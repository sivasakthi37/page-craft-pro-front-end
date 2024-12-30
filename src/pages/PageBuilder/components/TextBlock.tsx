import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { $getRoot, $createParagraphNode, $getSelection, EditorState, $isTextNode } from 'lexical';
import { $createHeadingNode } from '@lexical/rich-text';
import { $generateNodesFromDOM, $generateHtmlFromNodes } from '@lexical/html';
import { LexicalEditor } from 'lexical';

interface TextBlockProps {
  id: string;
  initialContent?: string;
  onChange?: (content: string) => void;
  onDelete?: () => void;
  onClick?: (event: React.MouseEvent) => void;
}

const theme = {
  // Theme styling goes here
  paragraph: 'mb-2',
  heading: {
    h1: 'text-3xl font-bold mb-4',
    h2: 'text-2xl font-bold mb-3',
    h3: 'text-xl font-bold mb-2',
  },
  list: {
    ul: 'list-disc ml-4 mb-2',
    ol: 'list-decimal ml-4 mb-2',
  },
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    code: 'font-mono bg-gray-100 rounded px-1',
  },
};

const TextBlock: React.FC<TextBlockProps> = ({
  id,
  initialContent,
  onChange,
  onDelete,
  onClick,
}) => {
  // console.log('initialContent', initialContent);

  const initialConfig = {
    namespace: `TextBlock-${id}`,
    theme,
    onError: (error: Error) => {
      console.error(error);
    },
    nodes: [
      HeadingNode,
      QuoteNode,
      ListItemNode,
      ListNode,
      CodeNode,
      CodeHighlightNode,
      AutoLinkNode,
      LinkNode,
    ],
  };

  const loadInitialContent = (editor: LexicalEditor) => {
    if (initialContent) {
      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(initialContent, 'text/html');
        const nodes = $generateNodesFromDOM(editor, dom);

        // Clear the root and append the generated nodes
        const root = $getRoot();
        root.clear();
        
        // Create a paragraph node and append the generated nodes to it
        const paragraphNode = $createParagraphNode();
        paragraphNode.append(...nodes);
        root.append(paragraphNode);
      });
    }
  };

  const Toolbar = () => {
    const [editor] = useLexicalComposerContext();

    const formatHeading = (level: 'h1' | 'h2' | 'h3') => {
      editor.update(() => {
        const selection = $getSelection();

        if (selection) {
          const nodes = selection.getNodes();
          nodes.forEach((node) => {
            const headingNode = $createHeadingNode(level);

            if ($isTextNode(node)) {
              node.replace(headingNode);
              headingNode.append(node);
            } else if (node.getType() === 'heading') {
              node.replace(headingNode);
            }
          });
        }
      });
    };

    const handleClick = (event: React.MouseEvent) => {
      event.stopPropagation();
      if (onClick) {
        onClick(event);
      }
    };

    return (
      <div className="flex items-center space-x-2 mb-2 p-2 border-b border-stroke dark:border-strokedark" onClick={handleClick}>
        <button
          onClick={() => formatHeading('h1')}
          className="p-1 hover:bg-gray-100 rounded"
        >
          H1
        </button>
        <button
          onClick={() => formatHeading('h2')}
          className="p-1 hover:bg-gray-100 rounded"
        >
          H2
        </button>
        <button
          onClick={() => formatHeading('h3')}
          className="p-1 hover:bg-gray-100 rounded"
        >
          H3
        </button>
        <div className="border-l border-stroke dark:border-strokedark h-6 mx-2" />
        <button
          onClick={onDelete}
          className="p-1 hover:bg-danger hover:text-white rounded"
        >
          Delete
        </button>
      </div>
    );
  };

  return (
    <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
      <LexicalComposer
        initialConfig={{
          ...initialConfig,
          editorState: (editor) => loadInitialContent(editor),
        }}
      >
        <div className="relative">
          <Toolbar />
          <div className="relative">
            <RichTextPlugin
              contentEditable={<ContentEditable className="border p-2 min-h-[100px] focus:outline-none" />}
              placeholder={<div className="absolute top-2 left-2 text-gray-400">Enter some text...</div>}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <ListPlugin />
            <LinkPlugin />
            <OnChangePlugin
              onChange={(editorState, editor) => {
                editorState.read(() => {
                  // Generate HTML from the current editor state
                  const htmlString = $generateHtmlFromNodes(editor);
                  
                  // Call onChange with the full HTML content
                  if (onChange) {
                    onChange(htmlString);
                  }
                });
              }}
            />
          </div>
        </div>
      </LexicalComposer>
    </div>
  );
};

export default TextBlock;
