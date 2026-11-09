export interface PageFrameProps {
  componentData: any
  header: any[]
  beforeBody: any[]
  pageBody: any
  afterBody: any[]
  left: any[]
  right: any[]
  footer: any[]
  sidebars?: { left: string; right: string }
}

export interface PageFrame {
  name: string
  css?: string
  render: (props: PageFrameProps) => any
}

export declare const CollapsibleSidebarsFrame: PageFrame
export default CollapsibleSidebarsFrame
