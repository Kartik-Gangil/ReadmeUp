
import MarkdownPreview from '@uiw/react-markdown-preview';

export default function MD_viewer({Source}:any) {

  return (
    <MarkdownPreview source={Source} style={{ padding: 16 }} />
  )
}