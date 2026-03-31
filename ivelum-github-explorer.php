<?php
/**
 * Plugin Name: Ivelum GitHub Explorer
 * Description: Embeds the Ivelum GitHub explorer React app into WordPress via shortcode and a server-side GitHub GraphQL proxy.
 * Version: 0.1.0
 * Author: Nemo
 * Requires at least: 6.4
 * Requires PHP: 8.1
 * Text Domain: ivelum-github-explorer
 */

if (!defined('ABSPATH')) {
    exit;
}

define('IVELUM_GITHUB_EXPLORER_VERSION', '0.1.0');
define('IVELUM_GITHUB_EXPLORER_FILE', __FILE__);
define('IVELUM_GITHUB_EXPLORER_DIR', plugin_dir_path(__FILE__));
define('IVELUM_GITHUB_EXPLORER_URL', plugin_dir_url(__FILE__));

require_once IVELUM_GITHUB_EXPLORER_DIR . 'includes/class-ivelum-github-explorer-rest-controller.php';
require_once IVELUM_GITHUB_EXPLORER_DIR . 'includes/class-ivelum-github-explorer-settings.php';
require_once IVELUM_GITHUB_EXPLORER_DIR . 'includes/class-ivelum-github-explorer-plugin.php';

function ivelum_github_explorer(): Ivelum_Github_Explorer_Plugin
{
    return Ivelum_Github_Explorer_Plugin::instance();
}

add_action('plugins_loaded', 'ivelum_github_explorer');
