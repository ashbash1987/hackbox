export default `{
  "version": 2,
  "theme": {
    "header": {
      "color": "black",
      "background": "#FAA516"
    },
    "main": {
      "background": "black"
    }
  },
  "presets": {
    "Question": {
      "type": "Text",
      "props": {
        "style": {
          "color": "white",
          "background": "black",
          "border": "4px solid #7391CA"
        }
      }
    },
    "Answers": {
      "type": "Choices",
      "props": {
        "multiSelect": true,
        "style": {
          "align": "start",
          "color": "white",
          "background": "black",
          "border": "2px solid #7391CA",
          "hover": {
            "background": "#FAA516",
            "color": "black"
          }
        },
        "submit": {
          "label": "Final Answer",
          "style": {
            "align": "center",
            "background": "#FAA516",
            "color": "black",
            "hover": {
              "background": "#0BDA51",
              "color": "white"
            }
          }
        }
      }
    }
  },
  "ui": {
    "header": {
      "text": "CAPTAIN"
    },
    "main": {
      "align": "start",
      "components": [
        {
          "type": "Question",
          "props": {
            "text": "Put these words <br> in **alphabetical** order."
          }
        },
        {
          "type": "Answers",
          "props": {
            "choices": [
              {
                "label": "**A:** Great",
                "value": "A",
                "keys": ["A", "1"],
                "style": {
                  "background": "#111111"
                }
              },
              {
                "label": "**B:** Zebra",
                "value": "B",
                "keys": ["B", "2"],
                "style": {
                  "background": "#222222"
                }
              },
              {
                "label": "**C:** London",
                "value": "C",
                "keys": ["C", "3"],
                "style": {
                  "background": "#333333"
                }
              },
              {
                "label": "**D:** Country",
                "value": "D",
                "keys": ["D", "4"],
                "style": {
                  "background": "#444444"
                }
              }
            ]
          }
        }
      ]
    }
  }
}`;
