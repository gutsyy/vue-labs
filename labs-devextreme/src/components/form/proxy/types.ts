import { ApplyValueMode, SelectAllMode } from 'devextreme/common'
import { DxElement, UserDefinedElement } from 'devextreme/core/element'
import { template } from 'devextreme/core/templates/template'
import { Properties } from 'devextreme/ui/select_box'
import { MultiTagPreparingEvent, SelectAllValueChangedEvent } from 'devextreme/ui/tag_box'

export interface DxTagBoxProperties extends Properties {
  /**
   * Specifies how the UI component applies values.
   */
  applyValueMode?: ApplyValueMode
  /**
   * A Boolean value specifying whether or not to hide selected items.
   */
  hideSelectedItems?: boolean
  /**
   * Specifies the limit on displayed tags. On exceeding it, the UI component replaces all tags with a single multi-tag that displays the number of selected items.
   */
  maxDisplayedTags?: number
  /**
   * A Boolean value specifying whether or not the UI component is multiline.
   */
  multiline?: boolean
  /**
   * A function that is executed before the multi-tag is rendered.
   */
  onMultiTagPreparing?: (e: MultiTagPreparingEvent) => void
  /**
   * A function that is executed when the &apos;Select All&apos; check box value is changed. Applies only if showSelectionControls is true.
   */
  onSelectAllValueChanged?: (e: SelectAllValueChangedEvent) => void
  /**
   * A function that is executed when a list item is selected or selection is canceled.
   */
  onSelectionChanged?: (e: any) => void
  /**
   * Specifies the mode in which all items are selected.
   */
  selectAllMode?: SelectAllMode
  /**
   * Gets the currently selected items.
   */
  selectedItems?: Array<string | number | any>
  /**
   * Specifies the text displayed at the &apos;Select All&apos; check box.
   */
  selectAllText?: string
  /**
   * Specifies whether the drop-down button is visible.
   */
  showDropDownButton?: boolean
  /**
   * Specifies the maximum filter query length in characters.
   */
  maxFilterQueryLength?: number
  /**
   * Specifies whether the multi-tag is shown without ordinary tags.
   */
  showMultiTagOnly?: boolean
  /**
   * Specifies a custom template for tags.
   */
  tagTemplate?: template | ((itemData: any, itemElement: DxElement) => string | UserDefinedElement)
  /**
   * Specifies the selected items.
   */
  value?: Array<string | number | any>
}
