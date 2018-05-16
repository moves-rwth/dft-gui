User manual
===========

# GUI structure

The DFT GUI consists of two parts: the [menu](#menu) in the upper part of the screen and the [canvas](#canvas) displaying the dynamic fault tree (DFT).

## Menu

The menu can be expanded/hidden with the button in the upper right corner.
The menu is divided into four tabs: [options](#options), [adding elements](#add-elements), [adding compounds](#add-compound) and [search](#search).

### Options
- An existing DFT can be loaded from the local hard drive by first selecting the file in the JSON format and then loading it into the canvas with `Load`.
- The DFT currently visible in the canvas can be exported into the JSON format with the `Save` button. This file can later be imported again into the GUI.
- An image of the DFT can be exported with the `Export` button.

### Add Elements
- DFT elements can be added to the canvas by either clicking the corresponding button (e.g. `BE` or `PAND`) or via drag and drop of the image of the element.
- Edges between elements can be added by first activating the `Add Edge` box.
  Afterwards an edge is added by first clicking on the parent element and then clicking on the child element.
  As an alternative, edges can also be added by drag and drop from the parent element.

### Add Compound
- Compound elements consisting of multiple DFT elements can be added similar to the DFT elements.

### Search
- The search field can be used to find specific DFT elements by their name.

## Canvas
The Canvas contains a visual representation of the DFT.
- The canvas can be moved via drag and drop. Zooming can be performed with the scroll wheel.
- Elements can be moved via drag and drop as well.
- Right clicking on a DFT element opens a [context menu](#context-menu) containing available actions for this element.

### Context Menu
- `Change element` opens a menu where the name, type and other properties of the DFT element can be edited.
- `Show info` displays all relevant information about the element. The fields `Children` and `Parents` can be used to switch the focus to specific children or parent elements.
- `Set as toplevel` indicates that the corresponding element should be the top level element of the DFT.
  A DFT has exactly one top level element.
- `Clone element` clones the complete subtree below the corresponding element.
- `Collapse element` forms a component of the corresponding element and its subtree.
  Afterwards, this component can be collapsed by clicking the `-` symbol in the upper left corner (and expanded again afterwards by clicking the `+` symbol).
  Collapsing elements helps keeping an overview of the DFT by only displaying the relevant gates and hiding their subtrees.