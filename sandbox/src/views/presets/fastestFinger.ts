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
            "align": "center"
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
            "text": "Put these words in alphabetical order."
          }
        },
        {
          "type": "Answers",
          "props": {
            "choices": [
              { "label": "A: Great", "value": "A", "keys": ["A", "1"] },
              { "label": "B: Zebra", "value": "B", "keys": ["B", "2"] },
              { "label": "C: London", "value": "C", "keys": ["C", "3"] },
              { "label": "D: Country", "value": "D", "keys": ["D", "4"] }
            ]
          }
        }
      ]
    }
  }
}`;
