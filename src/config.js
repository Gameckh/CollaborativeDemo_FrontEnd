export let config = 
{
    "ribbon": [
      {
        "id": "home",
        "text": "HOME",
        "buttonGroups": [
          {
            "label": "Undo",
            "thumbnailClass": "ribbon-thumbnail-undoredo",
            "commandGroup": {
              "children": [
                {
                  "direction": "vertical",
                  "commands": [
                    "undo",
                    "redo"
                  ]
                }
              ]
            }
          },
          {
            "label": "Clipboard",
            "thumbnailClass": "ribbon-thumbnail-clipboard",
            "commandGroup": {
              "children": [
                {
                  "commands": [
                    "paste"
                  ]
                },
                {
                  "direction": "vertical",
                  "commands": [
                    "cut",
                    "copy"
                  ]
                }
              ]
            }
          },
          {
            "label": "Fonts",
            "indicator": "indicator.Fonts",
            "thumbnailClass": "ribbon-thumbnail-fonts",
            "commandGroup": {
              "direction": "vertical",
              "children": [
                {
                  "commands": [
                    "font-family",
                    "font-size",
                    "increase-fontsize",
                    "decrease-fontsize"
                  ]
                },
                {
                  "commands": [
                    "font-weight",
                    "font-italic",
                    "font-underline",
                    "font-double-underline",
                    "separator",
                    "border",
                    "separator",
                    "backcolor",
                    "forecolor"
                  ]
                }
              ]
            }
          },
          {
            "label": "Alignment",
            "indicator": "indicator.Alignment",
            "thumbnailClass": "ribbon-thumbnail-alignment",
            "commandGroup": {
              "children": [
                {
                  "direction": "vertical",
                  "children": [
                    {
                      "commands": [
                        "top-align",
                        "middle-align",
                        "bottom-align",
                        "separator",
                        "orientationList"
                      ]
                    },
                    {
                      "commands": [
                        "left-align",
                        "center-align",
                        "right-align",
                        "separator",
                        "decrease-indent",
                        "increase-indent"
                      ]
                    }
                  ]
                },
                {
                  "type": "separator"
                },
                {
                  "direction": "vertical",
                  "children": [
                    {
                      "commands": [
                        "wrap-text"
                      ]
                    },
                    {
                      "commands": [
                        "merge-center",
                        "alignment.mergeList"
                      ]
                    }
                  ]
                }
              ]
            }
          },
          {
            "label": "Numbers",
            "indicator": "indicator.Numbers",
            "thumbnailClass": "ribbon-thumbnail-numbers",
            "commandGroup": {
              "direction": "vertical",
              "children": [
                {
                  "commands": [
                    "numberformat"
                  ]
                },
                {
                  "commands": [
                    "format-percentage",
                    "format-comma",
                    "separator",
                    "increase-decimal",
                    "decrease-decimal"
                  ]
                }
              ]
            }
          },
          {
            "label": "Cell Type",
            "thumbnailClass": "ribbon-thumbnail-celltype",
            "commandGroup": {
              "children": [
                {
                  "commands": [
                    "cell-type",
                    "cell-dropdowns"
                  ]
                }
              ]
            }
          },
          {
            "label": "Styles",
            "thumbnailClass": "ribbon-thumbnail-styles",
            "commandGroup": {
              "commands": [
                "ConditionFormat",
                "format-table2",
                "cell-styles",
                "cell-states"
              ]
            }
          },
          {
            "label": "Cells",
            "thumbnailClass": "ribbon-thumbnail-cells",
            "commandGroup": {
              "commands": [
                "cells.insert",
                "cells.delete",
                "cells.format"
              ]
            }
          },
          {
            "label": "Editing",
            "thumbnailClass": "ribbon-thumbnail-editing",
            "commandGroup": {
              "children": [
                {
                  "direction": "vertical",
                  "children": [
                    {
                      "commands": [
                        "editing.autoSum",
                        "editing.autoSumList"
                      ]
                    },
                    {
                      "commands": [
                        "editing.fillDown",
                        "editing.fillDownList"
                      ]
                    },
                    {
                      "commands": [
                        "clear",
                        "editing.clearAllList"
                      ]
                    }
                  ]
                },
                {
                  "commands": [
                    "editing.sortFilter"
                  ]
                },
                {
                  "commands": [
                    "editing.find"
                  ]
                }
              ]
            }
          }
        ]
      }
    ],
    "contextMenu": [
      "designer.cut",
      "designer.copy",
      "designer.paste",
      "designer.pasteAll",
      "designer.pasteFormula",
      "designer.pasteValues",
      "designer.pasteFormatting",
      "designer.pasteValuesFormatting",
      "designer.pasteFormulaFormatting",
      "designer.floatingObjectCut",
      "designer.floatingObjectCopy",
      "designer.cutShapes",
      "designer.copyShapes",
      "designer.pasteShapes",
      "separator",
      "designer.resetChartColor",
      "designer.changeChartTypeDialog",
      "designer.selectChartDataDialog",
      "designer.moveChartDialog",
      "designer.formatChart",
      "separator",
      "designer.insert_dialog",
      "designer.delete_dialog",
      "gc.spread.contextMenu.insertColumns",
      "gc.spread.contextMenu.deleteColumns",
      "gc.spread.contextMenu.insertRows",
      "gc.spread.contextMenu.deleteRows",
      "designer.tableInsert",
      "designer.tableDelete",
      "gc.spread.contextMenu.clearContents",
      "separator",
      "gc.spread.contextMenu.rowHeaderinsertCopiedCells",
      "gc.spread.contextMenu.rowHeaderinsertCutCells",
      "gc.spread.contextMenu.colHeaderinsertCopiedCells",
      "gc.spread.contextMenu.colHeaderinsertCutCells",
      "designer.insertCopiedCells",
      "designer.insertCutCells",
      "separator",
      "gc.spread.contextMenu.insertSheet",
      "gc.spread.contextMenu.deleteSheet",
      "designer.UnprotectSheet",
      "designer.protectSheet",
      "separator",
      "gc.spread.contextMenu.filter",
      "designer.sort",
      "designer.table",
      "separator",
      "gc.spread.contextMenu.insertComment",
      "gc.spread.contextMenu.editComment",
      "gc.spread.contextMenu.deleteComment",
      "gc.spread.contextMenu.toggleComment",
      "designer.formatComment",
      "separator",
      "designer.formatCells",
      "designer.editCellType",
      "designer.editCellDropdowns",
      "designer.link",
      "designer.editHyperlink",
      "designer.openHyperlink",
      "designer.removeHyperlink",
      "designer.removeHyperlinks",
      "separator",
      "designer.richText",
      "designer.defineName",
      "designer.cellTag",
      "designer.rowTag",
      "designer.colTag",
      "designer.columnWidth",
      "designer.rowHeight",
      "gc.spread.contextMenu.hideColumns",
      "gc.spread.contextMenu.hideRows",
      "gc.spread.contextMenu.unhideColumns",
      "gc.spread.contextMenu.unhideRows",
      "designer.columnHeaders",
      "designer.outlineColumn",
      "designer.rowHeaders",
      "separator",
      "designer.showTabColor",
      "gc.spread.contextMenu.hideSheet",
      "gc.spread.contextMenu.unhideSheet",
      "designer.sheetTag",
      "separator",
      "gc.spread.contextMenu.cut",
      "gc.spread.contextMenu.copy",
      "designer.slicerPasteOptions",
      "gc.spread.contextMenu.pasteAll",
      "gc.spread.contextMenu.slicerSortAscend",
      "gc.spread.contextMenu.slicerSortDescend",
      "gc.spread.contextMenu.removeSlicer",
      "designer.slicerProperty",
      "designer.slicerSetting",
      "separator",
      "shape-command-group",
      "designer.formatShapes",
      "designer.more-functions"
    ],
    "fileMenu": "fileMenuButton",
    "sidePanels": [
      {
        "position": "top",
        "allowResize": true,
        "command": "formulaBarPanel",
        "uiTemplate": "formulaBarTemplate"
      },
      {
        "position": "bottom",
        "command": "statusBarPanel",
        "uiTemplate": "statusBarPanelTemplate"
      },
      {
        "position": "full",
        "command": "fileMenuPanel",
        "uiTemplate": "FileMenuPanelTemplate"
      }
    ]
  }