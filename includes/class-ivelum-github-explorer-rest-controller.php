<?php

if (!defined('ABSPATH')) {
    exit;
}

class Ivelum_Github_Explorer_Rest_Controller
{
    public const OPTION_NAME = 'ivelum_github_explorer_github_token';
    public const REST_NAMESPACE = 'ivelum-github-explorer/v1';
    public const REST_ROUTE = '/github-graphql';
    public const TOKEN_CONSTANT = 'IVELUM_GITHUB_EXPLORER_GITHUB_TOKEN';
    private const ALLOWED_OPERATIONS = [
        'GetPublicRepositories',
        'RepoFile',
        'RepoFiles',
        'RepoMainBranch',
        'SearchRepos',
        'TestQuery',
    ];

    public function register_routes(): void
    {
        register_rest_route(
            self::REST_NAMESPACE,
            self::REST_ROUTE,
            [
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => [$this, 'proxy_graphql'],
                'permission_callback' => '__return_true',
            ]
        );
    }

    public function proxy_graphql(WP_REST_Request $request)
    {
        $token = $this->get_token();

        if ($token === '') {
            return new WP_Error(
                'ivelum_github_explorer_missing_token',
                __('GitHub token is not configured for Ivelum GitHub Explorer.', 'ivelum-github-explorer'),
                ['status' => 500]
            );
        }

        $payload = json_decode($request->get_body(), true);

        if (!is_array($payload) || empty($payload['query']) || !is_string($payload['query'])) {
            return new WP_Error(
                'ivelum_github_explorer_invalid_payload',
                __('GraphQL request payload must include a query string.', 'ivelum-github-explorer'),
                ['status' => 400]
            );
        }

        $operation_name = isset($payload['operationName']) && is_string($payload['operationName'])
            ? $payload['operationName']
            : '';

        if ($operation_name === '' || !in_array($operation_name, self::ALLOWED_OPERATIONS, true)) {
            return new WP_Error(
                'ivelum_github_explorer_operation_not_allowed',
                __('This GraphQL operation is not allowed by the Ivelum GitHub Explorer proxy.', 'ivelum-github-explorer'),
                ['status' => 403]
            );
        }

        $response = wp_remote_post(
            'https://api.github.com/graphql',
            [
                'headers' => [
                    'Authorization' => 'bearer ' . $token,
                    'Content-Type' => 'application/json',
                    'User-Agent' => 'Ivelum-GitHub-Explorer-WordPress-Plugin',
                ],
                'body' => wp_json_encode(
                    [
                        'query' => $payload['query'],
                        'variables' => isset($payload['variables']) ? $payload['variables'] : null,
                        'operationName' => $operation_name,
                    ]
                ),
                'timeout' => 20,
            ]
        );

        if (is_wp_error($response)) {
            return new WP_Error(
                'ivelum_github_explorer_upstream_request_failed',
                $response->get_error_message(),
                ['status' => 502]
            );
        }

        $status_code = wp_remote_retrieve_response_code($response);
        $body = wp_remote_retrieve_body($response);
        $decoded = json_decode($body, true);

        return new WP_REST_Response(
            is_array($decoded) ? $decoded : ['message' => $body],
            $status_code ?: 500
        );
    }

    public function get_token(): string
    {
        if (defined(self::TOKEN_CONSTANT)) {
            return trim((string) constant(self::TOKEN_CONSTANT));
        }

        return trim((string) get_option(self::OPTION_NAME, ''));
    }
}
