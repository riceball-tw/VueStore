import MyUploadAdapter from '@/helper/ckeditorUploadAdapter';

function MyCustomUploadAdapterPlugin(editor) {
  const theEditor = editor;
  theEditor.plugins.get('FileRepository').createUploadAdapter = (loader) => new MyUploadAdapter(loader);
}

export default function generateCkeditorConfig(defaultContent) {
  return {
    extraPlugins: [MyCustomUploadAdapterPlugin],
    toolbar: [
      'heading',
      '|',
      'bold',
      'italic',
      'blockQuote',
      '|',
      'uploadImage',
      'link',
      'insertTable',
      'mediaEmbed',
      '|',
      'undo',
      'redo',
    ],
    heading: {
      options: [
        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
        {
          model: 'heading2',
          view: 'h2',
          title: 'Heading 2',
          class: 'ck-heading_heading2',
        },
        {
          model: 'heading3',
          view: 'h3',
          title: 'Heading 3',
          class: 'ck-heading_heading3',
        },
        {
          model: 'heading4',
          view: 'h4',
          title: 'Heading 4',
          class: 'ck-heading_heading4',
        },
      ],
    },
    initialData: defaultContent,
  };
}
