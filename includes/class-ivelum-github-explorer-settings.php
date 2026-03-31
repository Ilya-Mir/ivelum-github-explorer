<?php

if (!defined('ABSPATH')) {
    exit;
}

class Ivelum_Github_Explorer_Settings
{
    private Ivelum_Github_Explorer_Rest_Controller $rest_controller;

    public function __construct(Ivelum_Github_Explorer_Rest_Controller $rest_controller)
    {
        $this->rest_controller = $rest_controller;
    }

    public function register(): void
    {
        add_action('admin_init', [$this, 'register_settings']);
        add_action('admin_menu', [$this, 'register_menu']);
    }

    public function register_settings(): void
    {
        register_setting(
            'ivelum_github_explorer',
            Ivelum_Github_Explorer_Rest_Controller::OPTION_NAME,
            [
                'type' => 'string',
                'sanitize_callback' => 'sanitize_text_field',
                'default' => '',
            ]
        );

        add_settings_section(
            'ivelum_github_explorer_main',
            __('GitHub Access', 'ivelum-github-explorer'),
            [$this, 'render_section_description'],
            'ivelum-github-explorer'
        );

        add_settings_field(
            Ivelum_Github_Explorer_Rest_Controller::OPTION_NAME,
            __('GitHub Personal Access Token', 'ivelum-github-explorer'),
            [$this, 'render_token_field'],
            'ivelum-github-explorer',
            'ivelum_github_explorer_main'
        );
    }

    public function register_menu(): void
    {
        add_options_page(
            __('Ivelum GitHub Explorer', 'ivelum-github-explorer'),
            __('Ivelum GitHub Explorer', 'ivelum-github-explorer'),
            'manage_options',
            'ivelum-github-explorer',
            [$this, 'render_page']
        );
    }

    public function render_section_description(): void
    {
        echo '<p>';
        esc_html_e(
            'Store the GitHub token here or define IVELUM_GITHUB_EXPLORER_GITHUB_TOKEN in wp-config.php. The token is used only on the server-side REST proxy.',
            'ivelum-github-explorer'
        );
        echo '</p>';
    }

    public function render_token_field(): void
    {
        $is_constant_defined = defined(Ivelum_Github_Explorer_Rest_Controller::TOKEN_CONSTANT);
        $value = $is_constant_defined
            ? '****************************************'
            : (string) get_option(Ivelum_Github_Explorer_Rest_Controller::OPTION_NAME, '');

        printf(
            '<input type="password" class="regular-text" name="%1$s" value="%2$s" %3$s autocomplete="off" />',
            esc_attr(Ivelum_Github_Explorer_Rest_Controller::OPTION_NAME),
            esc_attr($value),
            $is_constant_defined ? 'disabled="disabled"' : ''
        );

        echo '<p class="description">';

        if ($is_constant_defined) {
            esc_html_e(
                'The token is currently provided by the IVELUM_GITHUB_EXPLORER_GITHUB_TOKEN constant.',
                'ivelum-github-explorer'
            );
        } else {
            esc_html_e(
                'Use a GitHub Personal Access Token with access suitable for the GraphQL queries used by the plugin.',
                'ivelum-github-explorer'
            );
        }

        echo '</p>';
    }

    public function render_page(): void
    {
        if (!current_user_can('manage_options')) {
            return;
        }

        ?>
        <div class="wrap">
            <h1><?php esc_html_e('Ivelum GitHub Explorer', 'ivelum-github-explorer'); ?></h1>
            <p><?php esc_html_e('Insert the Ivelum GitHub Explorer block in the block editor, or use the shortcode [ivelum_github_explorer] as a compatibility fallback.', 'ivelum-github-explorer'); ?></p>
            <form action="options.php" method="post">
                <?php
                settings_fields('ivelum_github_explorer');
                do_settings_sections('ivelum-github-explorer');
                submit_button(__('Save Token', 'ivelum-github-explorer'));
                ?>
            </form>
        </div>
        <?php
    }
}
