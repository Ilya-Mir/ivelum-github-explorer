<?php

if (!defined('ABSPATH')) {
    exit;
}

class Ivelum_Github_Explorer_Plugin
{
    private const BLOCK_NAME = 'ivelum/github-explorer';
    private const BLOCK_DIR = 'blocks/github-explorer';
    private const SHORTCODE = 'ivelum_github_explorer';
    private const DEFAULT_ROUTE = '/Ilya-Mir/ivelum/folder/ivelum';

    private static ?self $instance = null;

    private Ivelum_Github_Explorer_Rest_Controller $rest_controller;
    private Ivelum_Github_Explorer_Settings $settings;
    private ?array $asset_manifest = null;
    private bool $runtime_script_added = false;

    private function __construct()
    {
        $this->rest_controller = new Ivelum_Github_Explorer_Rest_Controller();
        $this->settings = new Ivelum_Github_Explorer_Settings($this->rest_controller);

        add_action('init', [$this, 'register_plugin']);
        add_action('rest_api_init', [$this->rest_controller, 'register_routes']);

        $this->settings->register();
    }

    public static function instance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    public function register_plugin(): void
    {
        $this->register_frontend_assets();
        $this->register_block();
        add_shortcode(self::SHORTCODE, [$this, 'render_shortcode']);
    }

    public function render_shortcode(): string
    {
        return $this->render_app_container(
            'class="wp-block-ivelum-github-explorer ivelum-github-explorer-block"'
        );
    }

    public function render_block(array $attributes = [], string $content = '', $block = null): string
    {
        $wrapper_attributes = get_block_wrapper_attributes(
            [
                'class' => 'ivelum-github-explorer-block',
            ]
        );

        return $this->render_app_container($wrapper_attributes);
    }

    private function register_block(): void
    {
        $block_path = IVELUM_GITHUB_EXPLORER_DIR . self::BLOCK_DIR;

        if (!file_exists($block_path . '/block.json')) {
            return;
        }

        register_block_type_from_metadata(
            $block_path,
            [
                'render_callback' => [$this, 'render_block'],
            ]
        );
    }

    private function render_app_container(string $wrapper_attributes): string
    {
        if (!$this->has_built_assets()) {
            return $this->render_missing_assets_notice();
        }

        $this->enqueue_frontend_assets();

        return sprintf(
            '<div %1$s><div class="ivelum-github-explorer-root" data-ivelum-github-explorer-root="1"></div></div>',
            $wrapper_attributes
        );
    }

    private function register_frontend_assets(): void
    {
        if (!$this->has_built_assets()) {
            return;
        }

        wp_register_style(
            'ivelum-github-explorer-font',
            'https://fonts.cdnfonts.com/css/anonymous-pro',
            [],
            null
        );

        $asset_manifest = $this->get_asset_manifest();

        if (!$asset_manifest || empty($asset_manifest['files'])) {
            return;
        }

        $files = $asset_manifest['files'];

        if (!empty($files['main.css']) && is_string($files['main.css'])) {
            $relative_path = ltrim($files['main.css'], '/');
            wp_register_style(
                'ivelum-github-explorer-app',
                IVELUM_GITHUB_EXPLORER_URL . 'assets/app/' . $relative_path,
                [],
                $this->get_asset_version($relative_path)
            );
        }

        if (!empty($files['main.js']) && is_string($files['main.js'])) {
            $relative_path = ltrim($files['main.js'], '/');
            wp_register_script(
                'ivelum-github-explorer-app',
                IVELUM_GITHUB_EXPLORER_URL . 'assets/app/' . $relative_path,
                [],
                $this->get_asset_version($relative_path),
                [
                    'strategy' => 'defer',
                    'in_footer' => true,
                ]
            );
        }
    }

    private function enqueue_frontend_assets(): void
    {
        wp_enqueue_style('ivelum-github-explorer-font');

        if (wp_style_is('ivelum-github-explorer-app', 'registered')) {
            wp_enqueue_style('ivelum-github-explorer-app');
        }

        if (wp_script_is('ivelum-github-explorer-app', 'registered')) {
            if (!$this->runtime_script_added) {
                wp_add_inline_script(
                    'ivelum-github-explorer-app',
                    'window.ivelumGithubExplorer = ' . wp_json_encode($this->get_runtime_config()) . ';',
                    'before'
                );

                $this->runtime_script_added = true;
            }

            wp_enqueue_script('ivelum-github-explorer-app');
        }
    }

    private function get_runtime_config(): array
    {
        return [
            'assetBaseUrl' => esc_url_raw(IVELUM_GITHUB_EXPLORER_URL . 'assets/app/'),
            'defaultRoute' => self::DEFAULT_ROUTE,
            'graphqlEndpoint' => esc_url_raw(
                rest_url(Ivelum_Github_Explorer_Rest_Controller::REST_NAMESPACE . Ivelum_Github_Explorer_Rest_Controller::REST_ROUTE)
            ),
            'useHashRouter' => true,
            'wpNonce' => is_user_logged_in() ? wp_create_nonce('wp_rest') : '',
        ];
    }

    private function get_asset_version(string $relative_path): string
    {
        $asset_path = IVELUM_GITHUB_EXPLORER_DIR . 'assets/app/' . $relative_path;

        return file_exists($asset_path)
            ? (string) filemtime($asset_path)
            : IVELUM_GITHUB_EXPLORER_VERSION;
    }

    private function has_built_assets(): bool
    {
        return file_exists(IVELUM_GITHUB_EXPLORER_DIR . 'assets/app/asset-manifest.json');
    }

    private function get_asset_manifest(): ?array
    {
        if ($this->asset_manifest !== null) {
            return $this->asset_manifest;
        }

        $manifest_path = IVELUM_GITHUB_EXPLORER_DIR . 'assets/app/asset-manifest.json';

        if (!file_exists($manifest_path)) {
            return null;
        }

        $manifest_contents = file_get_contents($manifest_path);
        $decoded = json_decode($manifest_contents ?: '', true);

        if (!is_array($decoded)) {
            return null;
        }

        $this->asset_manifest = $decoded;

        return $this->asset_manifest;
    }

    private function render_missing_assets_notice(): string
    {
        $message = __('Ivelum GitHub Explorer assets are missing. Build the plugin frontend before using the block or shortcode.', 'ivelum-github-explorer');

        return sprintf(
            '<div class="ivelum-github-explorer__notice">%s</div>',
            esc_html($message)
        );
    }
}
