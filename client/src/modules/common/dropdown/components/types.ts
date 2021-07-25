export interface IDropdownLink {
  text?: string
  divider?: boolean
  handleClick?: (link: IDropdownLink) => void
  label?: string
  value?: string
  to?: string
}