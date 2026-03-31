<?php

if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

delete_option('ivelum_github_explorer_github_token');
