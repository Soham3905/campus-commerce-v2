import type { SDUINode } from "./types";

/**
 * ==============================================================================
 * SDUI Full Page JSON Schema
 * ==============================================================================
 * Beginner Note:
 * This file contains the complete Server-Driven UI (SDUI) blueprint for the
 * Campus Commerce landing page.
 *
 * How it works:
 * - "type": Identifies which React component to render (e.g. Header, ProductCard).
 * - "containerStyle": Custom CSS styles applied to that component.
 * - "placement": Coordinates on the 100-column grid for (mobile, tablet, desktop).
 * - "children": Sub-components nested inside this component.
 * - "data": Dynamic text, images, badges, and prices shown on the UI.
 */
export const fullPageJSON: SDUINode = {
  "type": "Home",
  "containerStyle": {
    "background": "linear-gradient(180deg, #F6F6F4 0%, #F6F6F4 100%)",
    "backgroundImage": "linear-gradient(180deg, #F6F6F4 0%, #F6F6F4 100%)",
    "backgroundColor": "#F6F6F4",
    "fontFamily": "'Inter Tight', Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    "color": "#101F26"
  },
  "statusCode": 200,
  "statusMessage": "Success",
  "actions": {},
  "children": [
    {
      "type": "Page",
      "containerStyle": {},
      "children": [
        {
          "type": "Header",
          "containerStyle": {
            "background": "linear-gradient(180deg, #103E4B 0%, #0D3540 100%)",
            "backgroundColor": "#0D3540",
            "height": "48px",
            "padding": "0 max(16px, calc((100% - 1180px) / 2))",
            "boxSizing": "border-box",
            "borderBottom": "1px solid rgba(255, 255, 255, 0.08)",
            "boxShadow": "0 1px 4px rgba(0, 0, 0, 0.15)",
            "overflowX": "auto",
            "scrollbarWidth": "none"
          },
          "placement": {
            "mobile": { "colStart": 1, "colEnd": 100, "rowStart": 1, "rowEnd": 5 },
            "tablet": { "colStart": 1, "colEnd": 100, "rowStart": 1, "rowEnd": 5 },
            "desktop": { "colStart": 1, "colEnd": 100, "rowStart": 1, "rowEnd": 5 }
          },
          "children": [
            {
              "type": "HeaderButton",
              "containerStyle": {
                "display": "inline-flex",
                "alignItems": "center",
                "justifyContent": "flex-start",
                "background": "none",
                "backgroundImage": "none",
                "backgroundColor": "transparent",
                "border": "none",
                "borderRadius": "0",
                "color": "#FFFFFF",
                "fontSize": "16px",
                "fontWeight": "700",
                "letterSpacing": "0.14em",
                "textTransform": "uppercase",
                "whiteSpace": "nowrap",
                "boxSizing": "border-box",
                "cursor": "pointer"
              },
              "data": {
                "id": "logo",
                "label": "SDUI·Commerce",
                "icon": "♥"
              },
              "actions": {
                "onTap": {
                  "type": "NAVIGATE",
                  "route": "home",
                  "actionName": "ON_TAP_LOGO"
                }
              }
            },
            {
              "type": "HeaderButton",
              "containerStyle": {
                "display": "inline-flex",
                "alignItems": "center",
                "justifyContent": "center",
                "background": "none",
                "backgroundImage": "none",
                "backgroundColor": "transparent",
                "border": "none",
                "borderRadius": "0",
                "color": "#FFFFFF",
                "fontSize": "13px",
                "fontWeight": "600",
                "letterSpacing": "0.01em",
                "whiteSpace": "nowrap",
                "boxSizing": "border-box",
                "cursor": "pointer",
                "boxShadow": "inset 0 -2px 0 #C4185F",
              },
              "data": {
                "id": "home",
                "label": "Home",
                "icon": ""
              },
              "actions": {
                "onTap": {
                  "type": "NAVIGATE",
                  "route": "home",
                  "actionName": "ON_TAP_NAV_HOME"
                }
              }
            },
            {
              "type": "HeaderButton",
              "containerStyle": {
                "display": "inline-flex",
                "alignItems": "center",
                "justifyContent": "center",
                "background": "none",
                "backgroundImage": "none",
                "backgroundColor": "transparent",
                "border": "none",
                "borderRadius": "0",
                "color": "rgba(255,255,255,0.72)",
                "fontSize": "13px",
                "fontWeight": "600",
                "letterSpacing": "0.01em",
                "whiteSpace": "nowrap",
                "boxSizing": "border-box",
                "cursor": "pointer"
              },
              "data": {
                "id": "categories",
                "label": "Categories",
                "icon": ""
              },
              "actions": {
                "onTap": {
                  "type": "NAVIGATE",
                  "route": "categories",
                  "actionName": "ON_TAP_NAV_CATEGORIES"
                }
              }
            },
            {
              "type": "HeaderButton",
              "containerStyle": {
                "display": "inline-flex",
                "alignItems": "center",
                "justifyContent": "center",
                "background": "none",
                "backgroundImage": "none",
                "backgroundColor": "transparent",
                "border": "none",
                "borderRadius": "0",
                "color": "rgba(255,255,255,0.72)",
                "fontSize": "13px",
                "fontWeight": "600",
                "letterSpacing": "0.01em",
                "whiteSpace": "nowrap",
                "boxSizing": "border-box",
                "cursor": "pointer"
              },
              "data": {
                "id": "deals",
                "label": "Deals",
                "icon": ""
              },
              "actions": {
                "onTap": {
                  "type": "NAVIGATE",
                  "route": "deals",
                  "actionName": "ON_TAP_NAV_DEALS"
                }
              }
            },
            {
              "type": "HeaderButton",
              "containerStyle": {
                "display": "inline-flex",
                "alignItems": "center",
                "justifyContent": "center",
                "background": "none",
                "backgroundImage": "none",
                "backgroundColor": "transparent",
                "border": "none",
                "borderRadius": "0",
                "color": "rgba(255,255,255,0.72)",
                "fontSize": "13px",
                "fontWeight": "600",
                "letterSpacing": "0.01em",
                "whiteSpace": "nowrap",
                "boxSizing": "border-box",
                "cursor": "pointer"
              },
              "data": {
                "id": "orders",
                "label": "Orders",
                "icon": ""
              },
              "actions": {
                "onTap": {
                  "type": "NAVIGATE",
                  "route": "orders",
                  "actionName": "ON_TAP_NAV_ORDERS"
                }
              }
            },
            {
              "type": "HeaderButton",
              "containerStyle": {
                "display": "inline-flex",
                "alignItems": "center",
                "justifyContent": "center",
                "background": "none",
                "backgroundImage": "none",
                "backgroundColor": "transparent",
                "border": "1px solid rgba(255,255,255,0.28)",
                "color": "#FFFFFF",
                "fontSize": "13px",
                "fontWeight": "600",
                "whiteSpace": "nowrap",
                "boxSizing": "border-box",
                "cursor": "pointer"
              },
              "data": {
                "id": "login",
                "label": "Log in",
                "icon": ""
              },
              "actions": {
                "onTap": {
                  "type": "NAVIGATE",
                  "route": "login",
                  "actionName": "ON_TAP_LOGIN"
                }
              }
            },
            {
              "type": "HeaderButton",
              "containerStyle": {
                "background": "linear-gradient(180deg, #D42A6E 0%, #C4185F 100%)",
                "backgroundImage": "linear-gradient(180deg, #D42A6E 0%, #C4185F 100%)",
                "backgroundColor": "#C4185F",
                "display": "inline-flex",
                "alignItems": "center",
                "justifyContent": "center",
                "borderRadius": "8px",
                "border": "1px solid #C4185F",
                "color": "#FFFFFF",
                "fontSize": "13px",
                "fontWeight": "600",
                "whiteSpace": "nowrap",
                "boxSizing": "border-box",
                "cursor": "pointer"
              },
              "data": {
                "id": "signup",
                "label": "Sign up",
                "icon": ""
              },
              "actions": {
                "onTap": {
                  "type": "NAVIGATE",
                  "route": "signup",
                  "actionName": "ON_TAP_SIGNUP"
                }
              }
            }
          ]
        },
        {
          "type": "Header",
          "containerStyle": {
            "background": "linear-gradient(180deg, #0D3540 0%, #08242A 100%)",
            "backgroundImage": "linear-gradient(180deg, #0D3540 0%, #08242A 100%)",
            "backgroundColor": "#08242A",
            "flexWrap": "wrap",
            "justifyContent": "flex-start",
            "padding": "12px max(16px, calc((100% - 1180px) / 2))",
            "boxSizing": "border-box",
            "position": "sticky",
            "top": "2px",
            "zIndex": "100",
            "color": "#FFFFFF",
            "borderBottom": "none",
            "boxShadow": "0 4px 14px rgba(10,42,49,0.18)"
          },
          "placement": {
            "mobile": { "colStart": 1, "colEnd": 100, "rowStart": 6, "rowEnd": 10 },
            "tablet": { "colStart": 1, "colEnd": 100, "rowStart": 6, "rowEnd": 10 },
            "desktop": { "colStart": 1, "colEnd": 100, "rowStart": 6, "rowEnd": 10 }
          },
          "children": [
            {
              "type": "SearchBar",
              "containerStyle": {
                "width": "340px",
                "alignItems": "center",
                "border": "1px solid #E4E7E4",
                "borderRadius": "12px",
                "boxShadow": "none",
                "boxSizing": "border-box",
                "color": "#101F26",
                "caretColor": "#C4185F",
                "background": "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)",
                "backgroundImage": "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)",
                "backgroundColor": "#FFFFFF"
              },
              "data": {
                "placeholder": "Search products, brands and more"
              },
              "actions": {
                "onChange": {
                  "type": "API_CALL",
                  "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                  "actionName": "ON_CHANGE_SEARCH",
                  "debounceDuration": 500
                },
                "onSubmit": {
                  "type": "API_CALL",
                  "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                  "actionName": "ON_SUBMIT_SEARCH"
                },
                "onFocus": {
                  "type": "API_CALL",
                  "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                  "actionName": "ON_FOCUS_SEARCH"
                },
                "onBlur": {
                  "type": "API_CALL",
                  "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                  "actionName": "ON_BLUR_SEARCH"
                }
              }
            },
            {
              "type": "HeaderButton",
              "containerStyle": {
                "display": "inline-flex",
                "alignItems": "center",
                "justifyContent": "center",
                "borderRadius": "12px",
                "fontSize": "12px",
                "fontWeight": "600",
                "letterSpacing": "0.005em",
                "whiteSpace": "nowrap",
                "boxSizing": "border-box",
                "cursor": "pointer",
                "background": "linear-gradient(180deg, #D42A6E 0%, #C4185F 100%)",
                "backgroundImage": "linear-gradient(180deg, #D42A6E 0%, #C4185F 100%)",
                "backgroundColor": "#C4185F",
                "border": "1px solid #C4185F",
                "color": "#FFFFFF",
                "boxShadow": "0 2px 10px rgba(196,24,95,0.28)"
              },
              "data": {
                "id": "cart",
                "label": "Cart",
                "icon": "🛒",
                "count": 3
              },
              "actions": {
                "onTap": {
                  "type": "NAVIGATE",
                  "route": "cart",
                  "actionName": "ON_TAP_CART_HEADER"
                }
              }
            },
            {
              "type": "HeaderButton",
              "containerStyle": {
                "display": "inline-flex",
                "alignItems": "center",
                "justifyContent": "center",
                "borderRadius": "12px",
                "fontSize": "12px",
                "fontWeight": "600",
                "letterSpacing": "0.005em",
                "whiteSpace": "nowrap",
                "boxSizing": "border-box",
                "cursor": "pointer",
                "background": "linear-gradient(180deg, #164955 0%, #123A44 100%)",
                "backgroundImage": "linear-gradient(180deg, #164955 0%, #123A44 100%)",
                "backgroundColor": "#123A44",
                "border": "1px solid rgba(255,255,255,0.16)",
                "color": "#FFFFFF"
              },
              "data": {
                "id": "wishlist",
                "label": "Wishlist",
                "icon": "♥",
                "count": 12
              },
              "actions": {
                "onTap": {
                  "type": "NAVIGATE",
                  "route": "wishlist",
                  "actionName": "ON_TAP_WISHLIST_HEADER"
                }
              }
            },
            {
              "type": "HeaderButton",
              "containerStyle": {
                "display": "inline-flex",
                "alignItems": "center",
                "justifyContent": "center",
                "borderRadius": "12px",
                "fontSize": "12px",
                "fontWeight": "600",
                "letterSpacing": "0.005em",
                "whiteSpace": "nowrap",
                "boxSizing": "border-box",
                "cursor": "pointer",
                "background": "linear-gradient(180deg, #164955 0%, #123A44 100%)",
                "backgroundImage": "linear-gradient(180deg, #164955 0%, #123A44 100%)",
                "backgroundColor": "#123A44",
                "border": "1px solid rgba(255,255,255,0.16)",
                "color": "#FFFFFF"
              },
              "data": {
                "id": "favourites",
                "label": "Favourites",
                "icon": "★",
                "count": 5
              },
              "actions": {
                "onTap": {
                  "type": "NAVIGATE",
                  "route": "favourites",
                  "actionName": "ON_TAP_FAVOURITES_HEADER"
                }
              }
            }
          ]
        },
        {
          "type": "StoryRow",
          "containerStyle": {
            "padding": "20px max(16px, calc((100% - 1180px) / 2)) 8px",
            "backgroundColor": "transparent",
          },
          "placement": {
            "mobile": { "colStart": 1, "colEnd": 100, "rowStart": 16, "rowEnd": 26 },
            "tablet": { "colStart": 1, "colEnd": 100, "rowStart": 11, "rowEnd": 22 },
            "desktop": { "colStart": 1, "colEnd": 100, "rowStart": 11, "rowEnd": 22 }
          },
          "actions": {
            "onDrop": {
              "type": "API_CALL",
              "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
              "actionName": "ON_DROP_STORY"
            }
          },
          "children": [
            {
              "type": "StoryCircle",
              "containerStyle": {
                "borderColor": "#123A44",
                "accentColor": "#123A44",
                "--story-ring": "#123A44",
                "--ring-color": "#123A44"
              },
              "data": {
                "label": "Sale",
                "imageUrl": "https://picsum.photos/id/2/200/200"
              },
              "actions": {
                "onDrag": {
                  "type": "API_CALL",
                  "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                  "actionName": "ON_DRAG_STORY"
                },
                "onTap": {
                  "type": "SHOW_IMAGE_MODAL",
                  "data": {
                    "imageUrl": "https://picsum.photos/id/2/600/600"
                  }
                }
              }
            },
            {
              "type": "StoryCircle",
              "containerStyle": {
                "borderColor": "#C4185F",
                "accentColor": "#C4185F",
                "--story-ring": "#C4185F",
                "--ring-color": "#C4185F"
              },
              "data": {
                "label": "Trending",
                "imageUrl": "https://picsum.photos/id/3/200/200"
              },
              "actions": {
                "onTap": {
                  "type": "SHOW_IMAGE_MODAL",
                  "data": {
                    "imageUrl": "https://picsum.photos/id/3/600/600"
                  }
                }
              }
            },
            {
              "type": "StoryCircle",
              "containerStyle": {
                "borderColor": "#C4185F",
                "accentColor": "#C4185F",
                "--story-ring": "#C4185F",
                "--ring-color": "#C4185F"
              },
              "data": {
                "label": "Electronics",
                "imageUrl": "https://picsum.photos/id/4/200/200"
              },
              "actions": {
                "onTap": {
                  "type": "SHOW_IMAGE_MODAL",
                  "data": {
                    "imageUrl": "https://picsum.photos/id/4/600/600"
                  }
                }
              }
            },
            {
              "type": "StoryCircle",
              "containerStyle": {
                "borderColor": "#C4185F",
                "accentColor": "#C4185F",
                "--story-ring": "#C4185F",
                "--ring-color": "#C4185F"
              },
              "data": {
                "label": "Kitchen",
                "imageUrl": "https://picsum.photos/id/30/200/200"
              },
              "actions": {
                "onTap": {
                  "type": "SHOW_IMAGE_MODAL",
                  "data": {
                    "imageUrl": "https://picsum.photos/id/30/600/600"
                  }
                }
              }
            },
            {
              "type": "StoryCircle",
              "containerStyle": {
                "borderColor": "#C4185F",
                "accentColor": "#C4185F",
                "--story-ring": "#C4185F",
                "--ring-color": "#C4185F"
              },
              "data": {
                "label": "Fashion",
                "imageUrl": "https://picsum.photos/id/21/200/200"
              },
              "actions": {
                "onTap": {
                  "type": "SHOW_IMAGE_MODAL",
                  "data": {
                    "imageUrl": "https://picsum.photos/id/21/600/600"
                  }
                }
              }
            },
            {
              "type": "StoryCircle",
              "containerStyle": {
                "borderColor": "#C4185F",
                "accentColor": "#C4185F",
                "--story-ring": "#C4185F",
                "--ring-color": "#C4185F"
              },
              "data": {
                "label": "Beauty",
                "imageUrl": "https://picsum.photos/id/64/200/200"
              },
              "actions": {
                "onTap": {
                  "type": "SHOW_IMAGE_MODAL",
                  "data": {
                    "imageUrl": "https://picsum.photos/id/64/600/600"
                  }
                }
              }
            }
          ]
        },
        {
          "type": "CategoryGrid",
          "containerStyle": {
            "background": "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)",
            "backgroundImage": "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)",
            "backgroundColor": "#FFFFFF",
            "borderRadius": "16px",
            "border": "1px solid #E4E7E4",
            "boxShadow": "0 1px 2px rgba(16,31,38,0.04)",
            "boxSizing": "border-box",
          },
          "placement": {
            "mobile": { "colStart": 1, "colEnd": 100, "rowStart": 27, "rowEnd": 35 },
            "tablet": { "colStart": 1, "colEnd": 100, "rowStart": 22, "rowEnd": 30 },
            "desktop": { "colStart": 1, "colEnd": 100, "rowStart": 22, "rowEnd": 30 }
          },
          "children": [
            {
              "type": "CategoryItem",
              "containerStyle": {
                "gap": "10px",
                "borderRadius": "12px",
                "fontWeight": "600",
                "fontSize": "16px",
                "color": "#101F26",
                "cursor": "pointer",
                "boxSizing": "border-box"
              },
              "data": {
                "label": "Mobiles",
                "icon": "📱"
              },
              "actions": {
                "onTap": {
                  "type": "API_CALL",
                  "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                  "actionName": "ON_TAP_MOBILES"
                }
              }
            },
            {
              "type": "CategoryItem",
              "containerStyle": {
                "gap": "10px",
                "borderRadius": "12px",
                "fontWeight": "600",
                "fontSize": "16px",
                "color": "#101F26",
                "cursor": "pointer",
                "boxSizing": "border-box"
              },
              "data": {
                "label": "Fashion",
                "icon": "👕"
              },
              "actions": {
                "onTap": {
                  "type": "API_CALL",
                  "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                  "actionName": "ON_TAP_FASHION"
                }
              }
            },
            {
              "type": "CategoryItem",
              "containerStyle": {
                "gap": "10px",
                "borderRadius": "12px",
                "fontWeight": "600",
                "fontSize": "16px",
                "color": "#101F26",
                "cursor": "pointer",
                "boxSizing": "border-box"
              },
              "data": {
                "label": "Laptops",
                "icon": "💻"
              },
              "actions": {
                "onTap": {
                  "type": "API_CALL",
                  "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                  "actionName": "ON_TAP_LAPTOPS"
                }
              }
            },
            {
              "type": "CategoryItem",
              "containerStyle": {
                "gap": "10px",
                "borderRadius": "12px",
                "fontWeight": "600",
                "fontSize": "16px",
                "color": "#101F26",
                "cursor": "pointer",
                "boxSizing": "border-box"
              },
              "data": {
                "label": "Home",
                "icon": "🏠"
              },
              "actions": {
                "onTap": {
                  "type": "API_CALL",
                  "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                  "actionName": "ON_TAP_HOME"
                }
              }
            },
            {
              "type": "CategoryItem",
              "containerStyle": {
                "gap": "10px",
                "borderRadius": "12px",
                "fontWeight": "600",
                "fontSize": "16px",
                "color": "#101F26",
                "cursor": "pointer",
                "boxSizing": "border-box"
              },
              "data": {
                "label": "Beauty",
                "icon": "💄"
              },
              "actions": {
                "onTap": {
                  "type": "API_CALL",
                  "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                  "actionName": "ON_TAP_BEAUTY"
                }
              }
            },
            {
              "type": "CategoryItem",
              "containerStyle": {
                "gap": "10px",
                "borderRadius": "12px",
                "fontWeight": "600",
                "fontSize": "16px",
                "color": "#101F26",
                "cursor": "pointer",
                "boxSizing": "border-box"
              },
              "data": {
                "label": "Grocery",
                "icon": "🛍️"
              },
              "actions": {
                "onTap": {
                  "type": "API_CALL",
                  "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                  "actionName": "ON_TAP_GROCERY"
                }
              }
            },
          ]
        },
        {
          "type": "Carousel",
          "containerStyle": {
            "borderRadius": "16px",
            "border": "1px solid #E4E7E4",
            "boxSizing": "border-box",
          },
          "placement": {
            "mobile": { "colStart": 1, "colEnd": 100, "rowStart": 36, "rowEnd": 58 },
            "tablet": { "colStart": 1, "colEnd": 100, "rowStart": 31, "rowEnd": 54 },
            "desktop": { "colStart": 1, "colEnd": 100, "rowStart": 31, "rowEnd": 54 }
          },
          "data": {
            "showDots": true,
            "autoPlay": true,
            "autoPlayInterval": 5000,
            "infiniteLoop": true
          },
          "actions": {
            "onSwipeLeft": {
              "type": "API_CALL",
              "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
              "actionName": "CAROUSEL_SWIPE_LEFT",
              "minSwipeDistance": 50
            },
            "onSwipeRight": {
              "type": "API_CALL",
              "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
              "actionName": "CAROUSEL_SWIPE_RIGHT",
              "minSwipeDistance": 50
            }
          },
          "children": [
            {
              "type": "Image",
              "containerStyle": {
                "height": "220px",
                "objectFit": "cover",
                "borderRadius": "16px",
              },
              "data": {
                "imageUrl": "https://picsum.photos/id/1080/1600/500",
                "altText": ""
              }
            },
            {
              "type": "IFrame",
              "containerStyle": {
                "height": "220px",
                "width": "100%",
                "borderRadius": "16px",
                "overflow": "hidden"
              },
              "data": {
                "src": "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1",
                "title": "Campus Tech & Deals Showcase",
                "allowFullScreen": true
              }
            },
            {
              "type": "Image",
              "containerStyle": {
                "height": "220px",
                "objectFit": "cover",
                "borderRadius": "16px",
              },
              "data": {
                "imageUrl": "https://picsum.photos/id/180/1600/500",
                "altText": ""
              }
            }
          ]
        },
        {
          "type": "HeroBanner",
          "containerStyle": {
            "borderRadius": "16px",
            "border": "1px solid #E4E7E4",
            "boxShadow": "0 1px 2px rgba(16,31,38,0.05)",
            "boxSizing": "border-box",
          },
          "placement": {
            "mobile": { "colStart": 1, "colEnd": 100, "rowStart": 59, "rowEnd": 99 },
            "tablet": { "colStart": 1, "colEnd": 100, "rowStart": 55, "rowEnd": 95 },
            "desktop": { "colStart": 1, "colEnd": 100, "rowStart": 55, "rowEnd": 95 }
          },
          "data": {
            "imageUrl": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1600&q=80",
            "title": "Season end sale",
            "subtitle": "Up to 70% off electronics. Ends Sunday.",
            "altText": "Season end sale banner"
          },
          "actions": {
            "onMount": {
              "type": "API_CALL",
              "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
              "actionName": "ON_MOUNT_HERO_BANNER"
            },
            "onError": {
              "type": "API_CALL",
              "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
              "actionName": "ON_ERROR_HERO_BANNER"
            }
          },
          "children": [
            {
              "type": "CountDownTimer",
              "containerStyle": {
                "backgroundColor": "transparent",
                "position": "absolute",
                "bottom": "100px",
                "left": "16px",
                "border": "1px solid rgba(255,255,255,0.24)",
                "color": "#FFFFFF",
                "fontFamily": "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
                "letterSpacing": "0.04em",
                "boxShadow": "0 4px 16px rgba(196,24,95,0.32)"
              },
              "data": {
                "label": "Flash sale ends in",
                "expiredText": "Sale ended",
                "targetDate": "2026-10-14T23:59:00",
                "showDays": "true",
                "format": "DD:HH:MM:SS"
              },
              "actions": {
                "onHover": {
                  "type": "API_CALL",
                  "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                  "actionName": "ON_HOVER_FLASH_TIMER"
                }
              }
            }
          ]
        },
        {
          "type": "Box",
          "containerStyle": {
            "display": "flex",
            "flexDirection": "row",
            "flexWrap": "nowrap",
            "gap": "14px",
            "overflowX": "auto",
            "scrollbarWidth": "none",
            "WebkitOverflowScrolling": "touch",
            "boxSizing": "border-box",
          },
          "placement": {
            "mobile": { "colStart": 1, "colEnd": 100, "rowStart": 100, "rowEnd": 111 },
            "tablet": { "colStart": 1, "colEnd": 100, "rowStart": 96, "rowEnd": 107 },
            "desktop": { "colStart": 1, "colEnd": 100, "rowStart": 96, "rowEnd": 107 }
          },
          "children": [
            {
              "type": "CouponCode",
              "containerStyle": {
                "flexShrink": "0",
                "minWidth": "280px",
                "maxWidth": "320px",
                "background": "linear-gradient(180deg, #FFF3DF 0%, #FFF3DF 100%)",
                "backgroundImage": "linear-gradient(180deg, #FFF3DF 0%, #FFF3DF 100%)",
                "backgroundColor": "#FFF3DF",
                "padding": "14px 16px",
                "borderRadius": "16px",
                "border": "1px dashed #E9C489",
                "color": "#8A5209",
                "fontSize": "14px",
                "fontWeight": "500",
                "fontFamily": "'Inter Tight', Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                "boxSizing": "border-box",
              },
              "data": {
                "title": "Save 20% on this order",
                "coupon": "SAVE20",
                "description": "Applies to orders above ₹999.",
                "copyLabel": "Copy code"
              },
              "actions": {
                "onCopy": {
                  "type": "COPY_TO_CLIPBOARD",
                  "value": "SAVE20"
                }
              }
            },
            {
              "type": "CouponCode",
              "containerStyle": {
                "flexShrink": "0",
                "minWidth": "280px",
                "maxWidth": "320px",
                "background": "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)",
                "backgroundImage": "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)",
                "backgroundColor": "#DCFCE7",
                "padding": "14px 16px",
                "borderRadius": "16px",
                "border": "1.5px dashed #86EFAC",
                "color": "#166534",
                "fontSize": "14px",
                "fontWeight": "500",
                "fontFamily": "'Inter Tight', Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                "boxSizing": "border-box",
                "boxShadow": "0 4px 16px rgba(22, 101, 52, 0.06)",
                "cursor": "pointer"
              },
              "data": {
                "title": "Flat ₹500 OFF Super Saver",
                "coupon": "FLAT500",
                "description": "Valid on purchases above ₹2,499.",
                "copyLabel": "Copy code"
              },
              "actions": {
                "onCopy": {
                  "type": "COPY_TO_CLIPBOARD",
                  "value": "FLAT500"
                }
              }
            },
            {
              "type": "CouponCode",
              "containerStyle": {
                "flexShrink": "0",
                "minWidth": "280px",
                "maxWidth": "320px",
                "background": "linear-gradient(135deg, #FAF5FF 0%, #EDE9FE 100%)",
                "backgroundImage": "linear-gradient(135deg, #FAF5FF 0%, #EDE9FE 100%)",
                "backgroundColor": "#EDE9FE",
                "padding": "14px 16px",
                "borderRadius": "16px",
                "border": "1.5px dashed #C4B5FD",
                "color": "#5B21B6",
                "fontSize": "14px",
                "fontWeight": "500",
                "fontFamily": "'Inter Tight', Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                "boxSizing": "border-box",
                "boxShadow": "0 4px 16px rgba(91, 33, 182, 0.06)",
                "cursor": "pointer"
              },
              "data": {
                "title": "Campus Special: 50% OFF",
                "coupon": "CAMPUS50",
                "description": "Max discount ₹300 for student members.",
                "copyLabel": "Copy code"
              },
              "actions": {
                "onCopy": {
                  "type": "COPY_TO_CLIPBOARD",
                  "value": "CAMPUS50"
                }
              }
            },
            {
              "type": "CouponCode",
              "containerStyle": {
                "flexShrink": "0",
                "minWidth": "280px",
                "maxWidth": "320px",
                "background": "linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)",
                "backgroundImage": "linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)",
                "backgroundColor": "#FFE4E6",
                "padding": "14px 16px",
                "borderRadius": "16px",
                "border": "1.5px dashed #FDA4AF",
                "color": "#9F1239",
                "fontSize": "14px",
                "fontWeight": "500",
                "fontFamily": "'Inter Tight', Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                "boxSizing": "border-box",
                "boxShadow": "0 4px 16px rgba(159, 18, 57, 0.06)",
                "cursor": "pointer"
              },
              "data": {
                "title": "Free Delivery + ₹150 OFF",
                "coupon": "FREEDROP",
                "description": "First campus order with instant express drop.",
                "copyLabel": "Copy code"
              },
              "actions": {
                "onCopy": {
                  "type": "COPY_TO_CLIPBOARD",
                  "value": "FREEDROP"
                }
              }
            },
            {
              "type": "CouponCode",
              "containerStyle": {
                "flexShrink": "0",
                "minWidth": "280px",
                "maxWidth": "320px",
                "background": "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
                "backgroundImage": "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
                "backgroundColor": "#DBEAFE",
                "padding": "14px 16px",
                "borderRadius": "16px",
                "border": "1.5px dashed #93C5FD",
                "color": "#1E40AF",
                "fontSize": "14px",
                "fontWeight": "500",
                "fontFamily": "'Inter Tight', Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                "boxSizing": "border-box",
                "boxShadow": "0 4px 16px rgba(30, 64, 175, 0.06)",
                "cursor": "pointer"
              },
              "data": {
                "title": "30% OFF Tech & Gadgets",
                "coupon": "TECH30",
                "description": "Valid on chargers, earphones & cables.",
                "copyLabel": "Copy code"
              },
              "actions": {
                "onCopy": {
                  "type": "COPY_TO_CLIPBOARD",
                  "value": "TECH30"
                }
              }
            }
          ]
        },
        {
          "type": "Box",
          "containerStyle": {
            "display": "flex",
            "flexDirection": "row",
            "flexWrap": "nowrap",
            "gap": "14px",
            "overflowX": "auto",
            "scrollbarWidth": "none",
            "WebkitOverflowScrolling": "touch",
            "boxSizing": "border-box",
          },
          "placement": {
            "mobile": { "colStart": 1, "colEnd": 100, "rowStart": 112, "rowEnd": 120 },
            "tablet": { "colStart": 1, "colEnd": 100, "rowStart": 108, "rowEnd": 116 },
            "desktop": { "colStart": 1, "colEnd": 100, "rowStart": 108, "rowEnd": 116 }
          },
          "children": [
            {
              "type": "CountDownTimer",
              "containerStyle": {
                "flexShrink": "0",
                "minWidth": "280px",
                "maxWidth": "320px",
                "background": "linear-gradient(180deg, #11404C 0%, #0A2A31 100%)",
                "backgroundImage": "linear-gradient(180deg, #11404C 0%, #0A2A31 100%)",
                "backgroundColor": "#0A2A31",
                "padding": "14px 16px",
                "borderRadius": "16px",
                "border": "1px solid rgba(255,255,255,0.12)",
                "color": "#FFFFFF",
                "fontFamily": "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
                "fontSize": "17px",
                "fontWeight": "600",
                "letterSpacing": "0.06em",
                "textAlign": "left",
                "boxSizing": "border-box",
                "boxShadow": "0 4px 16px rgba(10, 42, 49, 0.25)"
              },
              "data": {
                "label": "Deal of the day ends in",
                "expiredText": "Deal ended",
                "targetDate": "2026-09-13T23:59:00",
                "showDays": "false",
                "format": "HH:MM:SS"
              },
              "actions": {
                "onExpire": {
                  "type": "API_CALL",
                  "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                  "actionName": "DEAL_OF_THE_DAY_ENDED"
                }
              }
            },
            {
              "type": "CountDownTimer",
              "containerStyle": {
                "flexShrink": "0",
                "minWidth": "280px",
                "maxWidth": "320px",
                "background": "linear-gradient(180deg, #4A0E17 0%, #26050A 100%)",
                "backgroundImage": "linear-gradient(180deg, #4A0E17 0%, #26050A 100%)",
                "backgroundColor": "#26050A",
                "padding": "14px 16px",
                "borderRadius": "16px",
                "border": "1px solid rgba(244,63,94,0.25)",
                "color": "#FFE4E6",
                "fontFamily": "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
                "fontSize": "17px",
                "fontWeight": "600",
                "letterSpacing": "0.06em",
                "textAlign": "left",
                "boxSizing": "border-box",
                "boxShadow": "0 4px 16px rgba(74, 14, 23, 0.25)"
              },
              "data": {
                "label": "Flash sale ends in",
                "expiredText": "Flash sale ended",
                "targetDate": "2026-09-20T18:00:00",
                "showDays": "true",
                "format": "DD:HH:MM:SS"
              },
              "actions": {
                "onExpire": {
                  "type": "API_CALL",
                  "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                  "actionName": "FLASH_SALE_ENDED"
                }
              }
            },
            {
              "type": "CountDownTimer",
              "containerStyle": {
                "flexShrink": "0",
                "minWidth": "280px",
                "maxWidth": "320px",
                "background": "linear-gradient(180deg, #2E1065 0%, #170738 100%)",
                "backgroundImage": "linear-gradient(180deg, #2E1065 0%, #170738 100%)",
                "backgroundColor": "#170738",
                "padding": "14px 16px",
                "borderRadius": "16px",
                "border": "1px solid rgba(168,85,247,0.25)",
                "color": "#F3E8FF",
                "fontFamily": "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
                "fontSize": "17px",
                "fontWeight": "600",
                "letterSpacing": "0.06em",
                "textAlign": "left",
                "boxSizing": "border-box",
                "boxShadow": "0 4px 16px rgba(46, 16, 101, 0.25)"
              },
              "data": {
                "label": "Weekend tech drop in",
                "expiredText": "Drop live now!",
                "targetDate": "2026-10-01T12:00:00",
                "showDays": "true",
                "format": "DD:HH:MM:SS"
              },
              "actions": {
                "onExpire": {
                  "type": "API_CALL",
                  "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                  "actionName": "TECH_DROP_ENDED"
                }
              }
            },
            {
              "type": "CountDownTimer",
              "containerStyle": {
                "flexShrink": "0",
                "minWidth": "280px",
                "maxWidth": "320px",
                "background": "linear-gradient(180deg, #451A03 0%, #210C01 100%)",
                "backgroundImage": "linear-gradient(180deg, #451A03 0%, #210C01 100%)",
                "backgroundColor": "#210C01",
                "padding": "14px 16px",
                "borderRadius": "16px",
                "border": "1px solid rgba(245,158,11,0.25)",
                "color": "#FEF3C7",
                "fontFamily": "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
                "fontSize": "17px",
                "fontWeight": "600",
                "letterSpacing": "0.06em",
                "textAlign": "left",
                "boxSizing": "border-box",
                "boxShadow": "0 4px 16px rgba(69, 26, 3, 0.25)"
              },
              "data": {
                "label": "Limited stock offers in",
                "expiredText": "Offers closed",
                "targetDate": "2026-09-15T00:00:00",
                "showDays": "false",
                "format": "HH:MM:SS"
              },
              "actions": {
                "onExpire": {
                  "type": "API_CALL",
                  "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                  "actionName": "LIMITED_STOCK_ENDED"
                }
              }
            }
          ]
        },
        {
          "type": "ProductList",
          "containerStyle": {
            "gap": "14px",
            "overflowX": "auto",
            "WebkitOverflowScrolling": "touch",
            "boxSizing": "border-box",
          },
          "placement": {
            "mobile": { "colStart": 1, "colEnd": 100, "rowStart": 121, "rowEnd": 173 },
            "tablet": { "colStart": 1, "colEnd": 100, "rowStart": 117, "rowEnd": 169 },
            "desktop": { "colStart": 1, "colEnd": 100, "rowStart": 117, "rowEnd": 169 }
          },
          "actions": {
            "onScroll": {
              "type": "API_CALL",
              "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
              "actionName": "ON_SCROLL_PRODUCT",
              "debounceDuration": 1000
            },
            "onEndReached": {
              "type": "API_CALL",
              "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
              "actionName": "LOAD_MORE_PRODUCTS",
              "nearEndThreshold": 50
            }
          },
          "children": [
            {
              "type": "ProductCard",
              "containerStyle": {
                "background": "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)",
                "backgroundImage": "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)",
                "backgroundColor": "#FFFFFF",
                "flex": "0 0 auto",
                "height": "516px",
                "minHeight": "516px",
                "maxHeight": "516px",
                "alignSelf": "stretch",
                "display": "flex",
                "flexDirection": "column",
                "gap": "8px",
                "padding": "14px",
                "border": "1px solid #E4E7E4",
                "borderRadius": "16px",
                "boxShadow": "0 1px 2px rgba(16,31,38,0.04)",
                "boxSizing": "border-box",
              },
              "data": {
                "id": "serenelife-001"
              },
              "actions": {
                "onLongPress": {
                  "type": "SHOW_CONTEXT_MENU",
                  "data": {
                    "title": "Quick actions",
                    "options": [
                      {
                        "label": "Add to wishlist",
                        "icon": "♥",
                        "action": {
                          "type": "API_CALL",
                          "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                          "actionName": "ADD_TO_WISHLIST"
                        }
                      },
                      {
                        "label": "Add to cart",
                        "icon": "🛒",
                        "action": {
                          "type": "API_CALL",
                          "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                          "actionName": "ADD_TO_CART"
                        }
                      },
                      {
                        "label": "Add to favourites",
                        "icon": "★",
                        "action": {
                          "type": "API_CALL",
                          "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                          "actionName": "ADD_TO_FAVOURITE"
                        }
                      }
                    ]
                  }
                }
              },
              "children": [
                {
                  "type": "Image",
                  "containerStyle": {
                    "height": "176px",
                    "minHeight": "176px",
                    "flex": "0 0 176px",
                    "flexShrink": "0",
                    "width": "100%",
                    "maxHeight": "176px",
                    "objectFit": "contain",
                    "backgroundColor": "#FAFAF8",
                    "borderRadius": "10px",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "imageUrl": "https://m.media-amazon.com/images/I/816r5iLd4LL._AC_UL480_FMwebp_QL65_.jpg",
                    "altText": "SereneLife folding shopping cart"
                  }
                },
                {
                  "type": "Label",
                  "containerStyle": {
                    "height": "16px",
                    "minHeight": "16px",
                    "flex": "0 0 16px",
                    "flexShrink": "0",
                    "display": "flex",
                    "alignItems": "center",
                    "gap": "4px",
                    "overflow": "hidden",
                    "fontSize": "10px",
                    "fontWeight": "600",
                    "letterSpacing": "0.10em",
                    "textTransform": "uppercase",
                    "color": "#8D9A9D",
                    "boxSizing": "border-box"
                  },
                  "children": [
                    {
                      "type": "Sponsored",
                      "data": {
                        "text": "Sponsored"
                      }
                    }
                  ]
                },
                {
                  "type": "Badge",
                  "containerStyle": {
                    "height": "22px",
                    "minHeight": "22px",
                    "flex": "0 0 22px",
                    "flexShrink": "0",
                    "alignSelf": "flex-start",
                    "display": "inline-flex",
                    "alignItems": "center",
                    "padding": "0 9px",
                    "borderRadius": "999px",
                    "fontSize": "11px",
                    "fontWeight": "600",
                    "letterSpacing": "0.01em",
                    "whiteSpace": "nowrap",
                    "boxSizing": "border-box",
                    "backgroundColor": "#FFF3DF",
                    "color": "#8A5209"
                  },
                  "data": {
                    "text": "Limited time offer"
                  }
                },
                {
                  "type": "Title",
                  "containerStyle": {
                    "height": "16px",
                    "minHeight": "16px",
                    "flex": "0 0 16px",
                    "flexShrink": "0",
                    "overflow": "hidden",
                    "whiteSpace": "nowrap",
                    "textOverflow": "ellipsis",
                    "fontSize": "11px",
                    "fontWeight": "700",
                    "letterSpacing": "0.10em",
                    "textTransform": "uppercase",
                    "color": "#5E6E72",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "text": "SereneLife"
                  }
                },
                {
                  "type": "Description",
                  "containerStyle": {
                    "height": "60px",
                    "minHeight": "60px",
                    "flex": "0 0 60px",
                    "flexShrink": "0",
                    "display": "-webkit-box",
                    "WebkitLineClamp": "3",
                    "WebkitBoxOrient": "vertical",
                    "overflow": "hidden",
                    "maxHeight": "60px",
                    "fontSize": "14px",
                    "lineHeight": "20px",
                    "fontWeight": "500",
                    "letterSpacing": "-0.005em",
                    "color": "#101F26",
                    "overflowWrap": "anywhere",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "text": "Compact folding shopping cart with waterproof liner, 360° swivel wheels and a 70 lb capacity"
                  }
                },
                {
                  "type": "Rating",
                  "containerStyle": {
                    "height": "20px",
                    "minHeight": "20px",
                    "flex": "0 0 20px",
                    "flexShrink": "0",
                    "display": "flex",
                    "alignItems": "center",
                    "gap": "6px",
                    "fontFamily": "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
                    "fontSize": "12px",
                    "letterSpacing": "0.02em",
                    "color": "#5E6E72",
                    "boxSizing": "border-box"
                  },
                  "children": [
                    {
                      "type": "Score",
                      "data": {
                        "text": "4.4",
                        "out of": "5"
                      }
                    },
                    {
                      "type": "ReviewCount",
                      "data": {
                        "text": "376"
                      }
                    }
                  ]
                },
                {
                  "type": "PriceBlock",
                  "containerStyle": {
                    "height": "28px",
                    "minHeight": "28px",
                    "flex": "0 0 28px",
                    "flexShrink": "0",
                    "display": "flex",
                    "alignItems": "baseline",
                    "gap": "8px",
                    "overflow": "hidden",
                    "fontFamily": "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
                    "fontSize": "18px",
                    "fontWeight": "600",
                    "letterSpacing": "-0.01em",
                    "color": "#101F26",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "sellingPrice": "₹7,089",
                    "mrp": "₹12,250",
                    "discount": "42%"
                  }
                },
                {
                  "type": "OfferText",
                  "containerStyle": {
                    "height": "16px",
                    "minHeight": "16px",
                    "flex": "0 0 16px",
                    "flexShrink": "0",
                    "display": "-webkit-box",
                    "WebkitLineClamp": "1",
                    "WebkitBoxOrient": "vertical",
                    "overflow": "hidden",
                    "fontSize": "12px",
                    "fontWeight": "600",
                    "color": "#C4185F",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "text": "Up to 5% back with Amazon Pay ICICI card"
                  }
                },
                {
                  "type": "DeliveryInfo",
                  "containerStyle": {
                    "height": "18px",
                    "minHeight": "18px",
                    "flex": "0 0 18px",
                    "flexShrink": "0",
                    "overflow": "hidden",
                    "whiteSpace": "nowrap",
                    "textOverflow": "ellipsis",
                    "fontSize": "12px",
                    "color": "#5E6E72",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "prefix": "Free delivery",
                    "daysOffset": 7
                  }
                },
                {
                  "type": "Button",
                  "containerStyle": {
                    "height": "44px",
                    "minHeight": "44px",
                    "flex": "0 0 44px",
                    "flexShrink": "0",
                    "background": "linear-gradient(180deg, #D42A6E 0%, #C4185F 100%)",
                    "backgroundImage": "linear-gradient(180deg, #D42A6E 0%, #C4185F 100%)",
                    "backgroundColor": "#C4185F",
                    "marginTop": "auto",
                    "width": "calc(100% - 52px)",
                    "alignSelf": "flex-end",
                    "display": "flex",
                    "alignItems": "center",
                    "justifyContent": "center",
                    "padding": "0 16px",
                    "borderRadius": "12px",
                    "border": "none",
                    "color": "#FFFFFF",
                    "fontSize": "14px",
                    "fontWeight": "600",
                    "letterSpacing": "0.01em",
                    "cursor": "pointer",
                    "boxSizing": "border-box",
                    "boxShadow": "0 2px 10px rgba(196,24,95,0.24)"
                  },
                  "data": {
                    "label": "Add to cart"
                  },
                  "actions": {
                    "onTap": {
                      "type": "API_CALL",
                      "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                      "actionName": "ADD_TO_CART"
                    }
                  }
                },
                {
                  "type": "ShareButton",
                  "containerStyle": {
                    "position": "absolute",
                    "right": "14px",
                    "bottom": "8px",
                    "zIndex": "3",
                    "width": "44px",
                    "height": "44px",
                    "minWidth": "44px",
                    "padding": "0",
                    "margin": "0",
                    "borderRadius": "12px",
                    "display": "inline-flex",
                    "alignItems": "center",
                    "justifyContent": "center",
                    "gap": "0",
                    "backgroundColor": "#FFFFFF",
                    "border": "1px solid #E4E7E4",
                    "color": "#101F26",
                    "fontSize": "17px",
                    "lineHeight": "1",
                    "fontWeight": "600",
                    "cursor": "pointer",
                    "boxSizing": "border-box",
                    "overflow": "hidden",
                    "boxShadow": "none"
                  },
                  "data": {
                    "label": "",
                    "icon": "↗"
                  },
                  "actions": {
                    "onTap": {
                      "type": "OPEN_BOTTOM_SHEET",
                      "data": {
                        "title": "Share this product",
                        "options": [
                          {
                            "label": "WhatsApp",
                            "icon": "💬",
                            "action": {
                              "type": "API_CALL",
                              "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                              "actionName": "ON_TAP_SHARE_WHATSAPP"
                            }
                          },
                          {
                            "label": "Instagram",
                            "icon": "📸",
                            "action": {
                              "type": "API_CALL",
                              "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                              "actionName": "ON_TAP_SHARE_INSTAGRAM"
                            }
                          },
                          {
                            "label": "Copy link",
                            "icon": "🔗",
                            "action": {
                              "type": "COPY_TO_CLIPBOARD",
                              "value": "https://example.com/p/serenelife-001"
                            }
                          }
                        ]
                      }
                    }
                  }
                }
              ]
            },
            {
              "type": "ProductCard",
              "containerStyle": {
                "background": "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)",
                "backgroundImage": "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)",
                "backgroundColor": "#FFFFFF",
                "position": "relative",
                "flex": "0 0 auto",
                "width": "clamp(236px, 74vw, 268px)",
                "height": "516px",
                "minHeight": "516px",
                "maxHeight": "516px",
                "alignSelf": "stretch",
                "display": "flex",
                "flexDirection": "column",
                "justifyContent": "flex-start",
                "gap": "8px",
                "padding": "14px",
                "border": "1px solid #E4E7E4",
                "borderRadius": "16px",
                "boxShadow": "0 1px 2px rgba(16,31,38,0.04)",
                "boxSizing": "border-box",
                "minWidth": "0",
                "overflow": "hidden",
                "scrollSnapAlign": "start"
              },
              "data": {
                "id": "aurora-buds-002"
              },
              "children": [
                {
                  "type": "Image",
                  "containerStyle": {
                    "height": "176px",
                    "minHeight": "176px",
                    "flex": "0 0 176px",
                    "flexShrink": "0",
                    "width": "100%",
                    "maxHeight": "176px",
                    "objectFit": "contain",
                    "backgroundColor": "#FAFAF8",
                    "borderRadius": "10px",
                    "display": "block",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "imageUrl": "https://picsum.photos/id/1010/600/600",
                    "altText": "Aurora Buds Pro wireless earbuds"
                  }
                },
                {
                  "type": "Label",
                  "containerStyle": {
                    "height": "16px",
                    "minHeight": "16px",
                    "flex": "0 0 16px",
                    "flexShrink": "0",
                    "display": "flex",
                    "alignItems": "center",
                    "gap": "4px",
                    "overflow": "hidden",
                    "fontSize": "10px",
                    "fontWeight": "600",
                    "letterSpacing": "0.10em",
                    "textTransform": "uppercase",
                    "color": "#8D9A9D",
                    "boxSizing": "border-box"
                  },
                  "children": [
                    {
                      "type": "Sponsored",
                      "data": {
                        "text": " "
                      }
                    }
                  ]
                },
                {
                  "type": "Badge",
                  "containerStyle": {
                    "height": "22px",
                    "minHeight": "22px",
                    "flex": "0 0 22px",
                    "flexShrink": "0",
                    "alignSelf": "flex-start",
                    "display": "inline-flex",
                    "alignItems": "center",
                    "padding": "0 9px",
                    "borderRadius": "999px",
                    "fontSize": "11px",
                    "fontWeight": "600",
                    "letterSpacing": "0.01em",
                    "whiteSpace": "nowrap",
                    "boxSizing": "border-box",
                    "backgroundColor": "#E7EEED",
                    "color": "#0A2A31"
                  },
                  "data": {
                    "text": "Bestseller"
                  }
                },
                {
                  "type": "Title",
                  "containerStyle": {
                    "height": "16px",
                    "minHeight": "16px",
                    "flex": "0 0 16px",
                    "flexShrink": "0",
                    "overflow": "hidden",
                    "whiteSpace": "nowrap",
                    "textOverflow": "ellipsis",
                    "fontSize": "11px",
                    "fontWeight": "700",
                    "letterSpacing": "0.10em",
                    "textTransform": "uppercase",
                    "color": "#5E6E72",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "text": "Aurora Audio"
                  }
                },
                {
                  "type": "Description",
                  "containerStyle": {
                    "height": "60px",
                    "minHeight": "60px",
                    "flex": "0 0 60px",
                    "flexShrink": "0",
                    "display": "-webkit-box",
                    "WebkitLineClamp": "3",
                    "WebkitBoxOrient": "vertical",
                    "overflow": "hidden",
                    "maxHeight": "60px",
                    "fontSize": "14px",
                    "lineHeight": "20px",
                    "fontWeight": "500",
                    "letterSpacing": "-0.005em",
                    "color": "#101F26",
                    "overflowWrap": "anywhere",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "text": "Buds Pro ANC wireless earbuds — 42 hr battery, dual pairing, IPX5 water resistance"
                  }
                },
                {
                  "type": "Rating",
                  "containerStyle": {
                    "height": "20px",
                    "minHeight": "20px",
                    "flex": "0 0 20px",
                    "flexShrink": "0",
                    "display": "flex",
                    "alignItems": "center",
                    "gap": "6px",
                    "fontFamily": "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
                    "fontSize": "12px",
                    "letterSpacing": "0.02em",
                    "color": "#5E6E72",
                    "boxSizing": "border-box"
                  },
                  "children": [
                    {
                      "type": "Score",
                      "data": {
                        "text": "4.2",
                        "out of": "5"
                      }
                    },
                    {
                      "type": "ReviewCount",
                      "data": {
                        "text": "12,480"
                      }
                    }
                  ]
                },
                {
                  "type": "PriceBlock",
                  "containerStyle": {
                    "height": "28px",
                    "minHeight": "28px",
                    "flex": "0 0 28px",
                    "flexShrink": "0",
                    "display": "flex",
                    "alignItems": "baseline",
                    "gap": "8px",
                    "overflow": "hidden",
                    "fontFamily": "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
                    "fontSize": "18px",
                    "fontWeight": "600",
                    "letterSpacing": "-0.01em",
                    "color": "#101F26",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "sellingPrice": "₹2,499",
                    "mrp": "₹4,999",
                    "discount": "50%"
                  }
                },
                {
                  "type": "OfferText",
                  "containerStyle": {
                    "height": "16px",
                    "minHeight": "16px",
                    "flex": "0 0 16px",
                    "flexShrink": "0",
                    "display": "-webkit-box",
                    "WebkitLineClamp": "1",
                    "WebkitBoxOrient": "vertical",
                    "overflow": "hidden",
                    "fontSize": "12px",
                    "fontWeight": "600",
                    "color": "#C4185F",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "text": "No cost EMI on select cards"
                  }
                },
                {
                  "type": "DeliveryInfo",
                  "containerStyle": {
                    "height": "18px",
                    "minHeight": "18px",
                    "flex": "0 0 18px",
                    "flexShrink": "0",
                    "overflow": "hidden",
                    "whiteSpace": "nowrap",
                    "textOverflow": "ellipsis",
                    "fontSize": "12px",
                    "color": "#5E6E72",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "prefix": "Free delivery",
                    "daysOffset": 2
                  }
                },
                {
                  "type": "Button",
                  "containerStyle": {
                    "height": "44px",
                    "minHeight": "44px",
                    "flex": "0 0 44px",
                    "flexShrink": "0",
                    "background": "linear-gradient(180deg, #D42A6E 0%, #C4185F 100%)",
                    "backgroundImage": "linear-gradient(180deg, #D42A6E 0%, #C4185F 100%)",
                    "backgroundColor": "#C4185F",
                    "marginTop": "auto",
                    "width": "calc(100% - 52px)",
                    "alignSelf": "flex-end",
                    "display": "flex",
                    "alignItems": "center",
                    "justifyContent": "center",
                    "padding": "0 16px",
                    "borderRadius": "12px",
                    "border": "none",
                    "color": "#FFFFFF",
                    "fontSize": "14px",
                    "fontWeight": "600",
                    "letterSpacing": "0.01em",
                    "cursor": "pointer",
                    "boxSizing": "border-box",
                    "boxShadow": "0 2px 10px rgba(196,24,95,0.24)"
                  },
                  "data": {
                    "label": "Add to cart"
                  },
                  "actions": {
                    "onTap": {
                      "type": "API_CALL",
                      "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                      "actionName": "ADD_TO_CART"
                    }
                  }
                },
                {
                  "type": "ShareButton",
                  "containerStyle": {
                    "position": "absolute",
                    "right": "14px",
                    "bottom": "8px",
                    "zIndex": "3",
                    "width": "44px",
                    "height": "44px",
                    "minWidth": "44px",
                    "padding": "0",
                    "margin": "0",
                    "borderRadius": "12px",
                    "display": "inline-flex",
                    "alignItems": "center",
                    "justifyContent": "center",
                    "gap": "0",
                    "backgroundColor": "#FFFFFF",
                    "border": "1px solid #E4E7E4",
                    "color": "#101F26",
                    "fontSize": "17px",
                    "lineHeight": "1",
                    "fontWeight": "600",
                    "cursor": "pointer",
                    "boxSizing": "border-box",
                    "overflow": "hidden",
                    "boxShadow": "none"
                  },
                  "data": {
                    "label": "",
                    "icon": "↗"
                  },
                  "actions": {
                    "onTap": {
                      "type": "OPEN_BOTTOM_SHEET",
                      "data": {
                        "title": "Share this product",
                        "options": [
                          {
                            "label": "WhatsApp",
                            "icon": "💬",
                            "action": {
                              "type": "API_CALL",
                              "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                              "actionName": "ON_TAP_SHARE_WHATSAPP"
                            }
                          },
                          {
                            "label": "Instagram",
                            "icon": "📸",
                            "action": {
                              "type": "API_CALL",
                              "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                              "actionName": "ON_TAP_SHARE_INSTAGRAM"
                            }
                          },
                          {
                            "label": "Copy link",
                            "icon": "🔗",
                            "action": {
                              "type": "COPY_TO_CLIPBOARD",
                              "value": "https://example.com/p/aurora-buds-002"
                            }
                          }
                        ]
                      }
                    }
                  }
                }
              ]
            },
            {
              "type": "ProductCard",
              "containerStyle": {
                "background": "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)",
                "backgroundImage": "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)",
                "backgroundColor": "#FFFFFF",
                "position": "relative",
                "flex": "0 0 auto",
                "width": "clamp(236px, 74vw, 268px)",
                "height": "516px",
                "minHeight": "516px",
                "maxHeight": "516px",
                "alignSelf": "stretch",
                "display": "flex",
                "flexDirection": "column",
                "justifyContent": "flex-start",
                "gap": "8px",
                "padding": "14px",
                "border": "1px solid #E4E7E4",
                "borderRadius": "16px",
                "boxShadow": "0 1px 2px rgba(16,31,38,0.04)",
                "boxSizing": "border-box",
                "minWidth": "0",
                "overflow": "hidden",
                "scrollSnapAlign": "start"
              },
              "data": {
                "id": "kettleworks-003"
              },
              "children": [
                {
                  "type": "Image",
                  "containerStyle": {
                    "height": "176px",
                    "minHeight": "176px",
                    "flex": "0 0 176px",
                    "flexShrink": "0",
                    "width": "100%",
                    "maxHeight": "176px",
                    "objectFit": "contain",
                    "backgroundColor": "#FAFAF8",
                    "borderRadius": "10px",
                    "display": "block",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "imageUrl": "https://picsum.photos/id/30/600/600",
                    "altText": "Kettleworks electric kettle"
                  }
                },
                {
                  "type": "Label",
                  "containerStyle": {
                    "height": "16px",
                    "minHeight": "16px",
                    "flex": "0 0 16px",
                    "flexShrink": "0",
                    "display": "flex",
                    "alignItems": "center",
                    "gap": "4px",
                    "overflow": "hidden",
                    "fontSize": "10px",
                    "fontWeight": "600",
                    "letterSpacing": "0.10em",
                    "textTransform": "uppercase",
                    "color": "#8D9A9D",
                    "boxSizing": "border-box"
                  },
                  "children": [
                    {
                      "type": "Sponsored",
                      "data": {
                        "text": " "
                      }
                    }
                  ]
                },
                {
                  "type": "Badge",
                  "containerStyle": {
                    "height": "22px",
                    "minHeight": "22px",
                    "flex": "0 0 22px",
                    "flexShrink": "0",
                    "alignSelf": "flex-start",
                    "display": "inline-flex",
                    "alignItems": "center",
                    "padding": "0 9px",
                    "borderRadius": "999px",
                    "fontSize": "11px",
                    "fontWeight": "600",
                    "letterSpacing": "0.01em",
                    "whiteSpace": "nowrap",
                    "boxSizing": "border-box",
                    "backgroundColor": "#FDECF2",
                    "color": "#C4185F"
                  },
                  "data": {
                    "text": "Only 3 left"
                  }
                },
                {
                  "type": "Title",
                  "containerStyle": {
                    "height": "16px",
                    "minHeight": "16px",
                    "flex": "0 0 16px",
                    "flexShrink": "0",
                    "overflow": "hidden",
                    "whiteSpace": "nowrap",
                    "textOverflow": "ellipsis",
                    "fontSize": "11px",
                    "fontWeight": "700",
                    "letterSpacing": "0.10em",
                    "textTransform": "uppercase",
                    "color": "#5E6E72",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "text": "Kettleworks"
                  }
                },
                {
                  "type": "Description",
                  "containerStyle": {
                    "height": "60px",
                    "minHeight": "60px",
                    "flex": "0 0 60px",
                    "flexShrink": "0",
                    "display": "-webkit-box",
                    "WebkitLineClamp": "3",
                    "WebkitBoxOrient": "vertical",
                    "overflow": "hidden",
                    "maxHeight": "60px",
                    "fontSize": "14px",
                    "lineHeight": "20px",
                    "fontWeight": "500",
                    "letterSpacing": "-0.005em",
                    "color": "#101F26",
                    "overflowWrap": "anywhere",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "text": "1L stainless steel electric kettle with auto shut-off and boil-dry protection"
                  }
                },
                {
                  "type": "Rating",
                  "containerStyle": {
                    "height": "20px",
                    "minHeight": "20px",
                    "flex": "0 0 20px",
                    "flexShrink": "0",
                    "display": "flex",
                    "alignItems": "center",
                    "gap": "6px",
                    "fontFamily": "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
                    "fontSize": "12px",
                    "letterSpacing": "0.02em",
                    "color": "#5E6E72",
                    "boxSizing": "border-box"
                  },
                  "children": [
                    {
                      "type": "Score",
                      "data": {
                        "text": "4.6",
                        "out of": "5"
                      }
                    },
                    {
                      "type": "ReviewCount",
                      "data": {
                        "text": "2,043"
                      }
                    }
                  ]
                },
                {
                  "type": "PriceBlock",
                  "containerStyle": {
                    "height": "28px",
                    "minHeight": "28px",
                    "flex": "0 0 28px",
                    "flexShrink": "0",
                    "display": "flex",
                    "alignItems": "baseline",
                    "gap": "8px",
                    "overflow": "hidden",
                    "fontFamily": "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
                    "fontSize": "18px",
                    "fontWeight": "600",
                    "letterSpacing": "-0.01em",
                    "color": "#101F26",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "sellingPrice": "₹1,299",
                    "mrp": "₹1,999",
                    "discount": "35%"
                  }
                },
                {
                  "type": "OfferText",
                  "containerStyle": {
                    "height": "16px",
                    "minHeight": "16px",
                    "flex": "0 0 16px",
                    "flexShrink": "0",
                    "display": "-webkit-box",
                    "WebkitLineClamp": "1",
                    "WebkitBoxOrient": "vertical",
                    "overflow": "hidden",
                    "fontSize": "12px",
                    "fontWeight": "600",
                    "color": "#C4185F",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "text": "Extra 5% off with bank cards"
                  }
                },
                {
                  "type": "DeliveryInfo",
                  "containerStyle": {
                    "height": "18px",
                    "minHeight": "18px",
                    "flex": "0 0 18px",
                    "flexShrink": "0",
                    "overflow": "hidden",
                    "whiteSpace": "nowrap",
                    "textOverflow": "ellipsis",
                    "fontSize": "12px",
                    "color": "#5E6E72",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "prefix": "Free delivery",
                    "daysOffset": 4
                  }
                },
                {
                  "type": "Button",
                  "containerStyle": {
                    "height": "44px",
                    "minHeight": "44px",
                    "flex": "0 0 44px",
                    "flexShrink": "0",
                    "background": "linear-gradient(180deg, #D42A6E 0%, #C4185F 100%)",
                    "backgroundImage": "linear-gradient(180deg, #D42A6E 0%, #C4185F 100%)",
                    "backgroundColor": "#C4185F",
                    "marginTop": "auto",
                    "width": "calc(100% - 52px)",
                    "alignSelf": "flex-end",
                    "display": "flex",
                    "alignItems": "center",
                    "justifyContent": "center",
                    "padding": "0 16px",
                    "borderRadius": "12px",
                    "border": "none",
                    "color": "#FFFFFF",
                    "fontSize": "14px",
                    "fontWeight": "600",
                    "letterSpacing": "0.01em",
                    "cursor": "pointer",
                    "boxSizing": "border-box",
                    "boxShadow": "0 2px 10px rgba(196,24,95,0.24)"
                  },
                  "data": {
                    "label": "Add to cart"
                  },
                  "actions": {
                    "onTap": {
                      "type": "API_CALL",
                      "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                      "actionName": "ADD_TO_CART"
                    }
                  }
                },
                {
                  "type": "ShareButton",
                  "containerStyle": {
                    "position": "absolute",
                    "right": "14px",
                    "bottom": "8px",
                    "zIndex": "3",
                    "width": "44px",
                    "height": "44px",
                    "minWidth": "44px",
                    "padding": "0",
                    "margin": "0",
                    "borderRadius": "12px",
                    "display": "inline-flex",
                    "alignItems": "center",
                    "justifyContent": "center",
                    "gap": "0",
                    "backgroundColor": "#FFFFFF",
                    "border": "1px solid #E4E7E4",
                    "color": "#101F26",
                    "fontSize": "17px",
                    "lineHeight": "1",
                    "fontWeight": "600",
                    "cursor": "pointer",
                    "boxSizing": "border-box",
                    "overflow": "hidden",
                    "boxShadow": "none"
                  },
                  "data": {
                    "label": "",
                    "icon": "↗"
                  },
                  "actions": {
                    "onTap": {
                      "type": "OPEN_BOTTOM_SHEET",
                      "data": {
                        "title": "Share this product",
                        "options": [
                          {
                            "label": "WhatsApp",
                            "icon": "💬",
                            "action": {
                              "type": "API_CALL",
                              "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                              "actionName": "ON_TAP_SHARE_WHATSAPP"
                            }
                          },
                          {
                            "label": "Instagram",
                            "icon": "📸",
                            "action": {
                              "type": "API_CALL",
                              "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                              "actionName": "ON_TAP_SHARE_INSTAGRAM"
                            }
                          },
                          {
                            "label": "Copy link",
                            "icon": "🔗",
                            "action": {
                              "type": "COPY_TO_CLIPBOARD",
                              "value": "https://example.com/p/kettleworks-003"
                            }
                          }
                        ]
                      }
                    }
                  }
                }
              ]
            },
            {
              "type": "ProductCard",
              "containerStyle": {
                "background": "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)",
                "backgroundImage": "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)",
                "backgroundColor": "#FFFFFF",
                "position": "relative",
                "flex": "0 0 auto",
                "width": "clamp(236px, 74vw, 268px)",
                "height": "516px",
                "minHeight": "516px",
                "maxHeight": "516px",
                "alignSelf": "stretch",
                "display": "flex",
                "flexDirection": "column",
                "justifyContent": "flex-start",
                "gap": "8px",
                "padding": "14px",
                "border": "1px solid #E4E7E4",
                "borderRadius": "16px",
                "boxShadow": "0 1px 2px rgba(16,31,38,0.04)",
                "boxSizing": "border-box",
                "minWidth": "0",
                "overflow": "hidden",
                "scrollSnapAlign": "start"
              },
              "data": {
                "id": "nimbus-fryer-004"
              },
              "children": [
                {
                  "type": "Image",
                  "containerStyle": {
                    "height": "176px",
                    "minHeight": "176px",
                    "flex": "0 0 176px",
                    "flexShrink": "0",
                    "width": "100%",
                    "maxHeight": "176px",
                    "objectFit": "contain",
                    "backgroundColor": "#FAFAF8",
                    "borderRadius": "10px",
                    "display": "block",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "imageUrl": "https://picsum.photos/id/292/600/600",
                    "altText": "Nimbus air fryer"
                  }
                },
                {
                  "type": "Label",
                  "containerStyle": {
                    "height": "16px",
                    "minHeight": "16px",
                    "flex": "0 0 16px",
                    "flexShrink": "0",
                    "display": "flex",
                    "alignItems": "center",
                    "gap": "4px",
                    "overflow": "hidden",
                    "fontSize": "10px",
                    "fontWeight": "600",
                    "letterSpacing": "0.10em",
                    "textTransform": "uppercase",
                    "color": "#8D9A9D",
                    "boxSizing": "border-box"
                  },
                  "children": [
                    {
                      "type": "Sponsored",
                      "data": {
                        "text": " "
                      }
                    }
                  ]
                },
                {
                  "type": "Badge",
                  "containerStyle": {
                    "height": "22px",
                    "minHeight": "22px",
                    "flex": "0 0 22px",
                    "flexShrink": "0",
                    "alignSelf": "flex-start",
                    "display": "inline-flex",
                    "alignItems": "center",
                    "padding": "0 9px",
                    "borderRadius": "999px",
                    "fontSize": "11px",
                    "fontWeight": "600",
                    "letterSpacing": "0.01em",
                    "whiteSpace": "nowrap",
                    "boxSizing": "border-box",
                    "backgroundColor": "#FFF3DF",
                    "color": "#8A5209"
                  },
                  "data": {
                    "text": "Deal of the day"
                  }
                },
                {
                  "type": "Title",
                  "containerStyle": {
                    "height": "16px",
                    "minHeight": "16px",
                    "flex": "0 0 16px",
                    "flexShrink": "0",
                    "overflow": "hidden",
                    "whiteSpace": "nowrap",
                    "textOverflow": "ellipsis",
                    "fontSize": "11px",
                    "fontWeight": "700",
                    "letterSpacing": "0.10em",
                    "textTransform": "uppercase",
                    "color": "#5E6E72",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "text": "Nimbus"
                  }
                },
                {
                  "type": "Description",
                  "containerStyle": {
                    "height": "60px",
                    "minHeight": "60px",
                    "flex": "0 0 60px",
                    "flexShrink": "0",
                    "display": "-webkit-box",
                    "WebkitLineClamp": "3",
                    "WebkitBoxOrient": "vertical",
                    "overflow": "hidden",
                    "maxHeight": "60px",
                    "fontSize": "14px",
                    "lineHeight": "20px",
                    "fontWeight": "500",
                    "letterSpacing": "-0.005em",
                    "color": "#101F26",
                    "overflowWrap": "anywhere",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "text": "4.5L digital air fryer with 8 presets, dishwasher-safe basket and rapid heat circulation"
                  }
                },
                {
                  "type": "Rating",
                  "containerStyle": {
                    "height": "20px",
                    "minHeight": "20px",
                    "flex": "0 0 20px",
                    "flexShrink": "0",
                    "display": "flex",
                    "alignItems": "center",
                    "gap": "6px",
                    "fontFamily": "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
                    "fontSize": "12px",
                    "letterSpacing": "0.02em",
                    "color": "#5E6E72",
                    "boxSizing": "border-box"
                  },
                  "children": [
                    {
                      "type": "Score",
                      "data": {
                        "text": "4.3",
                        "out of": "5"
                      }
                    },
                    {
                      "type": "ReviewCount",
                      "data": {
                        "text": "8,912"
                      }
                    }
                  ]
                },
                {
                  "type": "PriceBlock",
                  "containerStyle": {
                    "height": "28px",
                    "minHeight": "28px",
                    "flex": "0 0 28px",
                    "flexShrink": "0",
                    "display": "flex",
                    "alignItems": "baseline",
                    "gap": "8px",
                    "overflow": "hidden",
                    "fontFamily": "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
                    "fontSize": "18px",
                    "fontWeight": "600",
                    "letterSpacing": "-0.01em",
                    "color": "#101F26",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "sellingPrice": "₹5,499",
                    "mrp": "₹8,999",
                    "discount": "39%"
                  }
                },
                {
                  "type": "OfferText",
                  "containerStyle": {
                    "height": "16px",
                    "minHeight": "16px",
                    "flex": "0 0 16px",
                    "flexShrink": "0",
                    "display": "-webkit-box",
                    "WebkitLineClamp": "1",
                    "WebkitBoxOrient": "vertical",
                    "overflow": "hidden",
                    "fontSize": "12px",
                    "fontWeight": "600",
                    "color": "#C4185F",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "text": "Save ₹500 with coupon SAVE20"
                  }
                },
                {
                  "type": "DeliveryInfo",
                  "containerStyle": {
                    "height": "18px",
                    "minHeight": "18px",
                    "flex": "0 0 18px",
                    "flexShrink": "0",
                    "overflow": "hidden",
                    "whiteSpace": "nowrap",
                    "textOverflow": "ellipsis",
                    "fontSize": "12px",
                    "color": "#5E6E72",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "prefix": "Free delivery",
                    "daysOffset": 3
                  }
                },
                {
                  "type": "Button",
                  "containerStyle": {
                    "height": "44px",
                    "minHeight": "44px",
                    "flex": "0 0 44px",
                    "flexShrink": "0",
                    "background": "linear-gradient(180deg, #D42A6E 0%, #C4185F 100%)",
                    "backgroundImage": "linear-gradient(180deg, #D42A6E 0%, #C4185F 100%)",
                    "backgroundColor": "#C4185F",
                    "marginTop": "auto",
                    "width": "calc(100% - 52px)",
                    "alignSelf": "flex-end",
                    "display": "flex",
                    "alignItems": "center",
                    "justifyContent": "center",
                    "padding": "0 16px",
                    "borderRadius": "12px",
                    "border": "none",
                    "color": "#FFFFFF",
                    "fontSize": "14px",
                    "fontWeight": "600",
                    "letterSpacing": "0.01em",
                    "cursor": "pointer",
                    "boxSizing": "border-box",
                    "boxShadow": "0 2px 10px rgba(196,24,95,0.24)"
                  },
                  "data": {
                    "label": "Add to cart"
                  },
                  "actions": {
                    "onTap": {
                      "type": "API_CALL",
                      "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                      "actionName": "ADD_TO_CART"
                    }
                  }
                },
                {
                  "type": "ShareButton",
                  "containerStyle": {
                    "position": "absolute",
                    "right": "14px",
                    "bottom": "8px",
                    "zIndex": "3",
                    "width": "44px",
                    "height": "44px",
                    "minWidth": "44px",
                    "padding": "0",
                    "margin": "0",
                    "borderRadius": "12px",
                    "display": "inline-flex",
                    "alignItems": "center",
                    "justifyContent": "center",
                    "gap": "0",
                    "backgroundColor": "#FFFFFF",
                    "border": "1px solid #E4E7E4",
                    "color": "#101F26",
                    "fontSize": "17px",
                    "lineHeight": "1",
                    "fontWeight": "600",
                    "cursor": "pointer",
                    "boxSizing": "border-box",
                    "overflow": "hidden",
                    "boxShadow": "none"
                  },
                  "data": {
                    "label": "",
                    "icon": "↗"
                  },
                  "actions": {
                    "onTap": {
                      "type": "OPEN_BOTTOM_SHEET",
                      "data": {
                        "title": "Share this product",
                        "options": [
                          {
                            "label": "WhatsApp",
                            "icon": "💬",
                            "action": {
                              "type": "API_CALL",
                              "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                              "actionName": "ON_TAP_SHARE_WHATSAPP"
                            }
                          },
                          {
                            "label": "Instagram",
                            "icon": "📸",
                            "action": {
                              "type": "API_CALL",
                              "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                              "actionName": "ON_TAP_SHARE_INSTAGRAM"
                            }
                          },
                          {
                            "label": "Copy link",
                            "icon": "🔗",
                            "action": {
                              "type": "COPY_TO_CLIPBOARD",
                              "value": "https://example.com/p/nimbus-fryer-004"
                            }
                          }
                        ]
                      }
                    }
                  }
                }
              ]
            },
            {
              "type": "ProductCard",
              "containerStyle": {
                "background": "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)",
                "backgroundImage": "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)",
                "backgroundColor": "#FFFFFF",
                "position": "relative",
                "flex": "0 0 auto",
                "width": "clamp(236px, 74vw, 268px)",
                "height": "516px",
                "minHeight": "516px",
                "maxHeight": "516px",
                "alignSelf": "stretch",
                "display": "flex",
                "flexDirection": "column",
                "justifyContent": "flex-start",
                "gap": "8px",
                "padding": "14px",
                "border": "1px solid #E4E7E4",
                "borderRadius": "16px",
                "boxShadow": "0 1px 2px rgba(16,31,38,0.04)",
                "boxSizing": "border-box",
                "minWidth": "0",
                "overflow": "hidden",
                "scrollSnapAlign": "start"
              },
              "data": {
                "id": "volt-charger-005"
              },
              "children": [
                {
                  "type": "Image",
                  "containerStyle": {
                    "height": "176px",
                    "minHeight": "176px",
                    "flex": "0 0 176px",
                    "flexShrink": "0",
                    "width": "100%",
                    "maxHeight": "176px",
                    "objectFit": "contain",
                    "backgroundColor": "#FAFAF8",
                    "borderRadius": "10px",
                    "display": "block",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "imageUrl": "https://picsum.photos/id/1078/600/600",
                    "altText": "Volt 65W GaN charger"
                  }
                },
                {
                  "type": "Label",
                  "containerStyle": {
                    "height": "16px",
                    "minHeight": "16px",
                    "flex": "0 0 16px",
                    "flexShrink": "0",
                    "display": "flex",
                    "alignItems": "center",
                    "gap": "4px",
                    "overflow": "hidden",
                    "fontSize": "10px",
                    "fontWeight": "600",
                    "letterSpacing": "0.10em",
                    "textTransform": "uppercase",
                    "color": "#8D9A9D",
                    "boxSizing": "border-box"
                  },
                  "children": [
                    {
                      "type": "Sponsored",
                      "data": {
                        "text": " "
                      }
                    }
                  ]
                },
                {
                  "type": "Badge",
                  "containerStyle": {
                    "height": "22px",
                    "minHeight": "22px",
                    "flex": "0 0 22px",
                    "flexShrink": "0",
                    "alignSelf": "flex-start",
                    "display": "inline-flex",
                    "alignItems": "center",
                    "padding": "0 9px",
                    "borderRadius": "999px",
                    "fontSize": "11px",
                    "fontWeight": "600",
                    "letterSpacing": "0.01em",
                    "whiteSpace": "nowrap",
                    "boxSizing": "border-box",
                    "backgroundColor": "#E7EEED",
                    "color": "#0A2A31"
                  },
                  "data": {
                    "text": "Bestseller"
                  }
                },
                {
                  "type": "Title",
                  "containerStyle": {
                    "height": "16px",
                    "minHeight": "16px",
                    "flex": "0 0 16px",
                    "flexShrink": "0",
                    "overflow": "hidden",
                    "whiteSpace": "nowrap",
                    "textOverflow": "ellipsis",
                    "fontSize": "11px",
                    "fontWeight": "700",
                    "letterSpacing": "0.10em",
                    "textTransform": "uppercase",
                    "color": "#5E6E72",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "text": "Volt"
                  }
                },
                {
                  "type": "Description",
                  "containerStyle": {
                    "height": "60px",
                    "minHeight": "60px",
                    "flex": "0 0 60px",
                    "flexShrink": "0",
                    "display": "-webkit-box",
                    "WebkitLineClamp": "3",
                    "WebkitBoxOrient": "vertical",
                    "overflow": "hidden",
                    "maxHeight": "60px",
                    "fontSize": "14px",
                    "lineHeight": "20px",
                    "fontWeight": "500",
                    "letterSpacing": "-0.005em",
                    "color": "#101F26",
                    "overflowWrap": "anywhere",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "text": "65W GaN fast charger with two USB-C ports and one USB-A, foldable pins"
                  }
                },
                {
                  "type": "Rating",
                  "containerStyle": {
                    "height": "20px",
                    "minHeight": "20px",
                    "flex": "0 0 20px",
                    "flexShrink": "0",
                    "display": "flex",
                    "alignItems": "center",
                    "gap": "6px",
                    "fontFamily": "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
                    "fontSize": "12px",
                    "letterSpacing": "0.02em",
                    "color": "#5E6E72",
                    "boxSizing": "border-box"
                  },
                  "children": [
                    {
                      "type": "Score",
                      "data": {
                        "text": "4.5",
                        "out of": "5"
                      }
                    },
                    {
                      "type": "ReviewCount",
                      "data": {
                        "text": "5,204"
                      }
                    }
                  ]
                },
                {
                  "type": "PriceBlock",
                  "containerStyle": {
                    "height": "28px",
                    "minHeight": "28px",
                    "flex": "0 0 28px",
                    "flexShrink": "0",
                    "display": "flex",
                    "alignItems": "baseline",
                    "gap": "8px",
                    "overflow": "hidden",
                    "fontFamily": "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
                    "fontSize": "18px",
                    "fontWeight": "600",
                    "letterSpacing": "-0.01em",
                    "color": "#101F26",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "sellingPrice": "₹1,899",
                    "mrp": "₹2,999",
                    "discount": "37%"
                  }
                },
                {
                  "type": "OfferText",
                  "containerStyle": {
                    "height": "16px",
                    "minHeight": "16px",
                    "flex": "0 0 16px",
                    "flexShrink": "0",
                    "display": "-webkit-box",
                    "WebkitLineClamp": "1",
                    "WebkitBoxOrient": "vertical",
                    "overflow": "hidden",
                    "fontSize": "12px",
                    "fontWeight": "600",
                    "color": "#C4185F",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "text": "Free 1 m braided cable included"
                  }
                },
                {
                  "type": "DeliveryInfo",
                  "containerStyle": {
                    "height": "18px",
                    "minHeight": "18px",
                    "flex": "0 0 18px",
                    "flexShrink": "0",
                    "overflow": "hidden",
                    "whiteSpace": "nowrap",
                    "textOverflow": "ellipsis",
                    "fontSize": "12px",
                    "color": "#5E6E72",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "prefix": "Free delivery",
                    "daysOffset": 2
                  }
                },
                {
                  "type": "Button",
                  "containerStyle": {
                    "height": "44px",
                    "minHeight": "44px",
                    "flex": "0 0 44px",
                    "flexShrink": "0",
                    "background": "linear-gradient(180deg, #D42A6E 0%, #C4185F 100%)",
                    "backgroundImage": "linear-gradient(180deg, #D42A6E 0%, #C4185F 100%)",
                    "backgroundColor": "#C4185F",
                    "marginTop": "auto",
                    "width": "calc(100% - 52px)",
                    "alignSelf": "flex-end",
                    "display": "flex",
                    "alignItems": "center",
                    "justifyContent": "center",
                    "padding": "0 16px",
                    "borderRadius": "12px",
                    "border": "none",
                    "color": "#FFFFFF",
                    "fontSize": "14px",
                    "fontWeight": "600",
                    "letterSpacing": "0.01em",
                    "cursor": "pointer",
                    "boxSizing": "border-box",
                    "boxShadow": "0 2px 10px rgba(196,24,95,0.24)"
                  },
                  "data": {
                    "label": "Add to cart"
                  },
                  "actions": {
                    "onTap": {
                      "type": "API_CALL",
                      "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                      "actionName": "ADD_TO_CART"
                    }
                  }
                },
                {
                  "type": "ShareButton",
                  "containerStyle": {
                    "position": "absolute",
                    "right": "14px",
                    "bottom": "8px",
                    "zIndex": "3",
                    "width": "44px",
                    "height": "44px",
                    "minWidth": "44px",
                    "padding": "0",
                    "margin": "0",
                    "borderRadius": "12px",
                    "display": "inline-flex",
                    "alignItems": "center",
                    "justifyContent": "center",
                    "gap": "0",
                    "backgroundColor": "#FFFFFF",
                    "border": "1px solid #E4E7E4",
                    "color": "#101F26",
                    "fontSize": "17px",
                    "lineHeight": "1",
                    "fontWeight": "600",
                    "cursor": "pointer",
                    "boxSizing": "border-box",
                    "overflow": "hidden",
                    "boxShadow": "none"
                  },
                  "data": {
                    "label": "",
                    "icon": "↗"
                  },
                  "actions": {
                    "onTap": {
                      "type": "OPEN_BOTTOM_SHEET",
                      "data": {
                        "title": "Share this product",
                        "options": [
                          {
                            "label": "WhatsApp",
                            "icon": "💬",
                            "action": {
                              "type": "API_CALL",
                              "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                              "actionName": "ON_TAP_SHARE_WHATSAPP"
                            }
                          },
                          {
                            "label": "Instagram",
                            "icon": "📸",
                            "action": {
                              "type": "API_CALL",
                              "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                              "actionName": "ON_TAP_SHARE_INSTAGRAM"
                            }
                          },
                          {
                            "label": "Copy link",
                            "icon": "🔗",
                            "action": {
                              "type": "COPY_TO_CLIPBOARD",
                              "value": "https://example.com/p/volt-charger-005"
                            }
                          }
                        ]
                      }
                    }
                  }
                }
              ]
            }
          ]
        },
        // This is Box And Text Component..
        // {
        //   "type": "Box",
        //   "containerStyle": {
        //     "padding": "20px",
        //     "backgroundColor": "#e0f2fe",
        //     "borderRadius": "12px",
        //     "display": "flex",
        //     "justifyContent": "center",
        //     "alignItems": "center",
        //     "border": "2px dashed #0284c7"
        //   },
        //   "placement": {
        //     "mobile": { "colStart": 1, "colEnd": 100, "rowStart": 174, "rowEnd": 180 },
        //     "tablet": { "colStart": 1, "colEnd": 100, "rowStart": 170, "rowEnd": 172 },
        //     "desktop": { "colStart": 1, "colEnd": 100, "rowStart": 170, "rowEnd": 172 }
        //   },
        //   "children": [
        //     {
        //       "type": "Text",
        //       "data": {
        //         "text": "This is a demonstration of Box and Text components!"
        //       },
        //       "containerStyle": {
        //         "fontSize": "16px",
        //         "fontWeight": "bold",
        //         "color": "#0369a1"
        //       }
        //     }
        //   ]
        // },
        // ── 10. SMALL PRODUCT CARDS (RESPONSIVE GRID) ───────────────────
        {
          "type": "Box",
          "placement": {
            "mobile": { "colStart": 1, "colEnd": 100, "rowStart": 174, "rowEnd": 350 },
            "tablet": { "colStart": 1, "colEnd": 100, "rowStart": 170, "rowEnd": 350 },
            "desktop": { "colStart": 1, "colEnd": 100, "rowStart": 170, "rowEnd": 350 }
          },
          "containerStyle": {
            "display": "grid",
            "gridTemplateColumns": "repeat(auto-fill, minmax(180px, 1fr))",
            "gap": "12px",
            "backgroundColor": "#F8FAFC",
            "alignContent": "start",
            "boxSizing": "border-box",
            "borderRadius": "16px"
          },
          "children": [
            {
              "type": "ProductCard",
              "containerStyle": {
                "width": "100%",
                "padding": "12px",
                "backgroundColor": "#FFFFFF",
                "borderRadius": "16px",
                "boxShadow": "0 2px 8px rgba(0, 0, 0, 0.04)",
                "border": "1px solid #F1F5F9"
              },
              "data": { "id": "s1" },
              "children": [
                { "type": "Image", "containerStyle": { "height": "140px", "objectFit": "cover", "borderRadius": "8px" }, "data": { "imageUrl": "https://picsum.photos/id/20/400/400", "altText": "Gas Stove" } },
                { "type": "Rating", "children": [{ "type": "Score", "data": { "text": "4.3" } }, { "type": "ReviewCount", "data": { "text": "84" } }] },
                { "type": "Title", "data": { "text": "BIGFLAME Power Hexa..." } },
                { "type": "PriceBlock", "data": { "sellingPrice": "₹6,632", "mrp": "₹12,800", "discount": "48%" } },
                { "type": "OfferText", "data": { "text": "₹6,512 with Bank offer" } }
              ]
            },
            {
              "type": "ProductCard",
              "containerStyle": {
                "width": "100%",
                "padding": "12px",
                "backgroundColor": "#FFFFFF",
                "borderRadius": "16px",
                "boxShadow": "0 2px 8px rgba(0, 0, 0, 0.04)",
                "border": "1px solid #F1F5F9"
              },
              "data": { "id": "s2" },
              "children": [
                { "type": "Image", "containerStyle": { "height": "140px", "objectFit": "cover", "borderRadius": "8px" }, "data": { "imageUrl": "https://picsum.photos/id/10/400/400", "altText": "Men Cargos" } },
                { "type": "Rating", "children": [{ "type": "Score", "data": { "text": "4.1" } }, { "type": "ReviewCount", "data": { "text": "120" } }] },
                { "type": "Title", "data": { "text": "VeBNoR Men Cargos" } },
                { "type": "PriceBlock", "data": { "sellingPrice": "₹524", "mrp": "₹1,999", "discount": "73%" } },
                { "type": "OfferText", "data": { "text": "Special discount" } }
              ]
            },
            {
              "type": "ProductCard",
              "containerStyle": {
                "width": "100%",
                "padding": "12px",
                "backgroundColor": "#FFFFFF",
                "borderRadius": "16px",
                "boxShadow": "0 2px 8px rgba(0, 0, 0, 0.04)",
                "border": "1px solid #F1F5F9"
              },
              "data": { "id": "s3" },
              "children": [
                { "type": "Image", "containerStyle": { "height": "140px", "objectFit": "cover", "borderRadius": "8px" }, "data": { "imageUrl": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", "altText": "Shoes" } },
                { "type": "Rating", "children": [{ "type": "Score", "data": { "text": "4.5" } }, { "type": "ReviewCount", "data": { "text": "210" } }] },
                { "type": "Title", "data": { "text": "RED TAPE Lifestyle Sneakers" } },
                { "type": "PriceBlock", "data": { "sellingPrice": "₹1,391", "mrp": "₹9,099", "discount": "84%" } },
                { "type": "OfferText", "data": { "text": "Limited time deal" } }
              ]
            },
            {
              "type": "ProductCard",
              "containerStyle": {
                "width": "100%",
                "padding": "12px",
                "backgroundColor": "#FFFFFF",
                "borderRadius": "16px",
                "boxShadow": "0 2px 8px rgba(0, 0, 0, 0.04)",
                "border": "1px solid #F1F5F9"
              },
              "data": { "id": "s4" },
              "children": [
                { "type": "Image", "containerStyle": { "height": "140px", "objectFit": "cover", "borderRadius": "8px" }, "data": { "imageUrl": "https://picsum.photos/id/30/400/400", "altText": "T-Shirt" } },
                { "type": "Rating", "children": [{ "type": "Score", "data": { "text": "4.0" } }, { "type": "ReviewCount", "data": { "text": "56" } }] },
                { "type": "Title", "data": { "text": "Anime Printed Cotton Tee" } },
                { "type": "PriceBlock", "data": { "sellingPrice": "₹399", "mrp": "₹999", "discount": "60%" } },
                { "type": "OfferText", "data": { "text": "Trending on campus" } }
              ]
            },
            {
              "type": "ProductCard",
              "containerStyle": {
                "width": "100%",
                "padding": "12px",
                "backgroundColor": "#FFFFFF",
                "borderRadius": "16px",
                "boxShadow": "0 2px 8px rgba(0, 0, 0, 0.04)",
                "border": "1px solid #F1F5F9"
              },
              "data": { "id": "s5" },
              "children": [
                { "type": "Image", "containerStyle": { "height": "140px", "objectFit": "cover", "borderRadius": "8px" }, "data": { "imageUrl": "https://picsum.photos/id/40/400/400", "altText": "Smart Watch" } },
                { "type": "Rating", "children": [{ "type": "Score", "data": { "text": "4.2" } }, { "type": "ReviewCount", "data": { "text": "340" } }] },
                { "type": "Title", "data": { "text": "Noise Pulse 2 Max Display" } },
                { "type": "PriceBlock", "data": { "sellingPrice": "₹1,499", "mrp": "₹5,999", "discount": "75%" } },
                { "type": "OfferText", "data": { "text": "Lowest price ever" } }
              ]
            },
            {
              "type": "ProductCard",
              "containerStyle": {
                "width": "100%",
                "padding": "12px",
                "backgroundColor": "#FFFFFF",
                "borderRadius": "16px",
                "boxShadow": "0 2px 8px rgba(0, 0, 0, 0.04)",
                "border": "1px solid #F1F5F9"
              },
              "data": { "id": "s6" },
              "children": [
                { "type": "Image", "containerStyle": { "height": "140px", "objectFit": "cover", "borderRadius": "8px" }, "data": { "imageUrl": "https://picsum.photos/id/50/400/400", "altText": "Backpack" } },
                { "type": "Rating", "children": [{ "type": "Score", "data": { "text": "4.6" } }, { "type": "ReviewCount", "data": { "text": "1.2k" } }] },
                { "type": "Title", "data": { "text": "Skybags 25L Campus Bag" } },
                { "type": "PriceBlock", "data": { "sellingPrice": "₹899", "mrp": "₹2,100", "discount": "57%" } },
                { "type": "OfferText", "data": { "text": "Bestseller" } }
              ]
            },
            {
              "type": "ProductCard",
              "containerStyle": {
                "width": "100%",
                "padding": "12px",
                "backgroundColor": "#FFFFFF",
                "borderRadius": "16px",
                "boxShadow": "0 2px 8px rgba(0, 0, 0, 0.04)",
                "border": "1px solid #F1F5F9"
              },
              "data": { "id": "s7" },
              "children": [
                { "type": "Image", "containerStyle": { "height": "140px", "objectFit": "cover", "borderRadius": "8px" }, "data": { "imageUrl": "https://picsum.photos/id/60/400/400", "altText": "Headphones" } },
                { "type": "Rating", "children": [{ "type": "Score", "data": { "text": "4.4" } }, { "type": "ReviewCount", "data": { "text": "800" } }] },
                { "type": "Title", "data": { "text": "boAt Rockerz 450 Wireless" } },
                { "type": "PriceBlock", "data": { "sellingPrice": "₹1,299", "mrp": "₹3,990", "discount": "67%" } },
                { "type": "OfferText", "data": { "text": "Mega savings" } }
              ]
            },
            {
              "type": "ProductCard",
              "containerStyle": {
                "width": "100%",
                "padding": "12px",
                "backgroundColor": "#FFFFFF",
                "borderRadius": "16px",
                "boxShadow": "0 2px 8px rgba(0, 0, 0, 0.04)",
                "border": "1px solid #F1F5F9"
              },
              "data": { "id": "s8" },
              "children": [
                { "type": "Image", "containerStyle": { "height": "140px", "objectFit": "cover", "borderRadius": "8px" }, "data": { "imageUrl": "https://picsum.photos/id/70/400/400", "altText": "Sunglasses" } },
                { "type": "Rating", "children": [{ "type": "Score", "data": { "text": "3.9" } }, { "type": "ReviewCount", "data": { "text": "23" } }] },
                { "type": "Title", "data": { "text": "Fastrack UV Protect Shades" } },
                { "type": "PriceBlock", "data": { "sellingPrice": "₹599", "mrp": "₹999", "discount": "40%" } },
                { "type": "OfferText", "data": { "text": "Hot Deal" } }
              ]
            }
          ]
        },
        {
          "type": "Footer",
          "containerStyle": {
            "background": "linear-gradient(180deg, #0D323B 0%, #0A2A31 100%)",
            "backgroundImage": "linear-gradient(180deg, #0D323B 0%, #0A2A31 100%)",
            "backgroundColor": "#0A2A31",
            "padding": "20px",
            "borderRadius": "12px",
            "color": "#CFDDDC",
            "fontSize": "14px",
            "lineHeight": "22px",
            "boxSizing": "border-box",
            "borderTop": "1px solid rgba(255,255,255,0.08)"
          },
          "placement": {
            "mobile": { "colStart": 1, "colEnd": 100, "rowStart": 352, "rowEnd": 380 },
            "tablet": { "colStart": 1, "colEnd": 100, "rowStart": 352, "rowEnd": 380 },
            "desktop": { "colStart": 1, "colEnd": 100, "rowStart": 352, "rowEnd": 380 }
          },
          "data": {
            "sections": [
              {
                "title": "Get to know us",
                "links": [
                  {
                    "label": "About us",
                    "url": "https://example.com/about"
                  },
                  {
                    "label": "Careers",
                    "url": "https://example.com/careers"
                  },
                  {
                    "label": "Community",
                    "url": "https://example.com/community"
                  }
                ]
              },
              {
                "title": "Let us help you",
                "links": [
                  {
                    "label": "Your orders",
                    "url": "https://example.com/orders"
                  },
                  {
                    "label": "Returns and refunds",
                    "url": "https://example.com/returns"
                  },
                  {
                    "label": "Help centre",
                    "url": "https://example.com/help"
                  }
                ]
              },
              {
                "title": "Connect with us",
                "links": [
                  {
                    "label": "Instagram",
                    "url": "https://instagram.com"
                  },
                  {
                    "label": "Facebook",
                    "url": "https://facebook.com"
                  },
                  {
                    "label": "X",
                    "url": "https://x.com"
                  },
                  {
                    "label": "LinkedIn",
                    "url": "https://linkedin.com"
                  }
                ]
              }
            ],
            "copyrightText": "© 2024–2026, SDUI-Commerce, Inc. or its affiliates"
          }
        }
      ]
    },
    {
      "type": "NavBar",
      "containerStyle": {
        "position": "sticky",
        "bottom": "0",
        "width": "100%",
        "height": "60px",
        "backgroundColor": "#FFFFFF",
        "zIndex": "210",
        "borderTop": "1px solid #E5E7EB",
        "display": "flex"
      },
      "data": {
        "items": [
          {
            "label": "Home",
            "icon": "🏠",
            "isActive": "true",
            "actions": {
              "onTap": {
                "type": "NAVIGATE",
                "route": "home"
              }
            }
          },
          {
            "label": "Categories",
            "icon": "🗂️",
            "isActive": "false",
            "actions": {
              "onTap": {
                "type": "NAVIGATE",
                "route": "categories"
              }
            }
          },
          {
            "label": "Cart",
            "icon": "🛒",
            "isActive": "false",
            "actions": {
              "onTap": {
                "type": "NAVIGATE",
                "route": "cart"
              }
            }
          },
          {
            "label": "Account",
            "icon": "👤",
            "isActive": "false",
            "actions": {
              "onTap": {
                "type": "NAVIGATE",
                "route": "account"
              }
            }
          }
        ]
      }
    }
  ]
}