import { useCallback, useContext, createContext } from 'react'
import { createEditor } from 'slate'
import { Slate, Editable } from 'slate-react';

import { conceptNameToUrlSafeId } from '../gatekit'

const NoteContext = createContext()

const Block = ({ children }) => {
  return (
    <div>{children}</div>
  )
}

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

const Concept = ({ element, children }) => {
  const { conceptPrefix } = useContext(NoteContext)
  return (
    <a className="concept"
      href={`${conceptPrefix}${conceptNameToUrlSafeId(element.name)}`}>
      {children}
    </a>
  )
}

const Element = (props) => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case 'block-quote':
      return <Block element={element}><blockquote {...attributes}>{children}</blockquote></Block>
    case 'heading-one':
      return <Block element={element}><h1 className="text-3xl" {...attributes}>{children}</h1></Block>
    case 'heading-two':
      return <Block element={element}><h2 className="text-2xl" {...attributes}>{children}</h2></Block>
    case 'heading-three':
      return <Block element={element}><h3 className="text-xl" {...attributes}>{children}</h3></Block>
    case 'bulleted-list':
      return <Block element={element}><ul className="list-disc list-inside" {...attributes}>{children}</ul></Block>
    case 'numbered-list':
      return <Block element={element}><ol className="list-decimal list-inside" {...attributes}>{children}</ol></Block>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    case 'image':
      return (
        <Block element={element}>
          <img alt={element.alt || ""} src={element.url} style={{ width: element.width }} />
        </Block>
      )
    case 'video':
      return <Block element={element}><video {...props} /></Block>
    case 'link':
      return <a className="text-blue-600" href={element.url}>{children}</a>
    case 'concept':
      return <Concept {...props} />
    case 'tag':
      return <TagElement {...props} />
    case 'check-list-item':
      return <Block element={element}><ChecklistItemElement {...props} /></Block>
    /*case 'table':
      return (
        <Block element={element}>
          <Table {...props} />
        </Block>
      )
    case 'table-row':
      return <tr {...attributes}>{children}</tr>
    case 'table-cell':
      return <td {...attributes}>{children}</td>
      */
    default:
      return <Block element={element}><p {...attributes}>{children}</p></Block>
  }
}

export default function NoteBody({ conceptPrefix, json }) {
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const renderElement = useCallback(props => <Element {...props} />, [])
  const editor = createEditor()
  return (
    <NoteContext.Provider value={{ conceptPrefix }}>
      <Slate editor={editor} value={JSON.parse(json)}>
        <Editable
          renderLeaf={renderLeaf}
          renderElement={renderElement}
          readOnly />
      </Slate>
    </NoteContext.Provider>
  )
}