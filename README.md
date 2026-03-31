# Ivelum GitHub Explorer WordPress Plugin

Primary insertion method:

- Gutenberg block: `Ivelum GitHub Explorer`

Compatibility fallback:

```text
[ivelum_github_explorer]
```

What this plugin does:

- Registers a dynamic block via `block.json` and `register_block_type_from_metadata()`.
- Enqueues the built React application through standard WordPress script/style APIs.
- Uses a WordPress REST endpoint as a server-side proxy for GitHub GraphQL requests.
- Stores the GitHub token in a WordPress option or via `IVELUM_GITHUB_EXPLORER_GITHUB_TOKEN` in `wp-config.php`.
- Starts the explorer at `Ilya-Mir/ivelum/tree/main/ivelum`.

Plugin source layout:

- `ivelum-github-explorer.php`: plugin bootstrap.
- `includes/`: shortcode, settings page, REST controller.
- `blocks/`: block metadata and editor registration script.
- `assets/app/`: built React bundle copied from the CRA app.
- `app-src/`: copy of the React source tree for reference.
