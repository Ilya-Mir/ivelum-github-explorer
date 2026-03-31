(function (blocks, blockEditor, components, element, i18n) {
  var el = element.createElement;
  var useBlockProps = blockEditor.useBlockProps;
  var __ = i18n.__;
  var Placeholder = components.Placeholder;

  blocks.registerBlockType('ivelum/github-explorer', {
    edit: function () {
      var blockProps = useBlockProps({
        className: 'ivelum-github-explorer-editor-placeholder',
      });

      return el(
        'div',
        blockProps,
        el(
          Placeholder,
          {
            icon: 'portfolio',
            label: __('Ivelum GitHub Explorer', 'ivelum-github-explorer'),
            instructions: __(
              'The React explorer renders on the frontend. Use full-width alignment for the best layout and configure the GitHub token in Settings -> Ivelum GitHub Explorer.',
              'ivelum-github-explorer'
            ),
          },
          el(
            'p',
            null,
            __(
              'This block is server-rendered and uses a WordPress REST proxy for GitHub GraphQL requests.',
              'ivelum-github-explorer'
            )
          )
        )
      );
    },
    save: function () {
      return null;
    },
  });
})(
  window.wp.blocks,
  window.wp.blockEditor,
  window.wp.components,
  window.wp.element,
  window.wp.i18n
);
