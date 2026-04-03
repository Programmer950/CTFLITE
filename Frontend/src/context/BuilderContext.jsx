import { createContext, useContext, useReducer, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { defaultPages } from '../data/DefaultPages';

const BuilderContext = createContext(null);

const MAX_HISTORY = 50;

const initialState = {
  pages: defaultPages,
  activePage: 0,
  selectedId: null,
  selectedIds: [],          // multi-select
  clipboardElements: [],    // copy/paste
  customFonts: [],          // [{name, url}]
  history: [],
  future: [],
  viewport: 'desktop',
  previewMode: false,
};

function reducer(state, action) {
  switch (action.type) {

    case 'SELECT_ELEMENT':
      return { ...state, selectedId: action.id, selectedIds: [action.id] };

    case 'DESELECT':
      return { ...state, selectedId: null, selectedIds: [] };

    case 'TOGGLE_SELECT': {
      const already = state.selectedIds.includes(action.id);
      const newIds = already
        ? state.selectedIds.filter(i => i !== action.id)
        : [...state.selectedIds, action.id];
      const newSingle = newIds.length > 0 ? newIds[newIds.length - 1] : null;
      return { ...state, selectedIds: newIds, selectedId: newSingle };
    }

    case 'SELECT_MANY':
      return { ...state, selectedIds: action.ids, selectedId: action.ids[action.ids.length - 1] || null };

    case 'SELECT_ALL': {
      const page = state.pages[state.activePage];
      const ids = (page?.elements || []).map(e => e.id);
      return { ...state, selectedIds: ids, selectedId: ids[ids.length - 1] || null };
    }

    case 'SWITCH_PAGE':
      return { ...state, activePage: action.index, selectedId: null, selectedIds: [] };

    case 'SET_VIEWPORT':
      return { ...state, viewport: action.viewport };

    case 'TOGGLE_PREVIEW':
      return { ...state, previewMode: !state.previewMode, selectedId: null, selectedIds: [] };

    case 'ADD_ELEMENT': {
      const snapshot = JSON.parse(JSON.stringify(state.pages));
      const newEl = { ...action.element, id: uuidv4() };
      const pages = state.pages.map((p, i) =>
        i === state.activePage ? { ...p, elements: [...p.elements, newEl] } : p
      );
      return {
        ...state,
        pages,
        selectedId: newEl.id,
        selectedIds: [newEl.id],
        history: [...state.history.slice(-MAX_HISTORY), snapshot],
        future: [],
      };
    }

    case 'UPDATE_ELEMENT': {
      const snapshot = JSON.parse(JSON.stringify(state.pages));
      const pages = state.pages.map((p, i) => {
        if (i !== state.activePage) return p;
        return {
          ...p,
          elements: p.elements.map(el =>
            el.id === action.id ? deepMerge(el, action.updates) : el
          ),
        };
      });
      return {
        ...state,
        pages,
        history: [...state.history.slice(-MAX_HISTORY), snapshot],
        future: [],
      };
    }

    case 'BULK_UPDATE': {
      // apply same updates to all selectedIds
      const snapshot = JSON.parse(JSON.stringify(state.pages));
      const ids = new Set(action.ids);
      const pages = state.pages.map((p, i) => {
        if (i !== state.activePage) return p;
        return {
          ...p,
          elements: p.elements.map(el =>
            ids.has(el.id) ? deepMerge(el, action.updates) : el
          ),
        };
      });
      return {
        ...state,
        pages,
        history: [...state.history.slice(-MAX_HISTORY), snapshot],
        future: [],
      };
    }

    case 'DELETE_ELEMENT': {
      const snapshot = JSON.parse(JSON.stringify(state.pages));
      const pages = state.pages.map((p, i) =>
        i === state.activePage
          ? { ...p, elements: p.elements.filter(el => el.id !== action.id) }
          : p
      );
      return {
        ...state,
        pages,
        selectedId: null,
        selectedIds: state.selectedIds.filter(i => i !== action.id),
        history: [...state.history.slice(-MAX_HISTORY), snapshot],
        future: [],
      };
    }

    case 'BULK_DELETE': {
      const snapshot = JSON.parse(JSON.stringify(state.pages));
      const ids = new Set(action.ids);
      const pages = state.pages.map((p, i) =>
        i === state.activePage
          ? { ...p, elements: p.elements.filter(el => !ids.has(el.id)) }
          : p
      );
      return {
        ...state,
        pages,
        selectedId: null,
        selectedIds: [],
        history: [...state.history.slice(-MAX_HISTORY), snapshot],
        future: [],
      };
    }

    case 'REORDER_ELEMENTS': {
      const snapshot = JSON.parse(JSON.stringify(state.pages));
      const pages = state.pages.map((p, i) =>
        i === state.activePage ? { ...p, elements: action.elements } : p
      );
      return { ...state, pages, history: [...state.history.slice(-MAX_HISTORY), snapshot], future: [] };
    }

    case 'MOVE_ELEMENT': {
      const snapshot = JSON.parse(JSON.stringify(state.pages));
      const pages = state.pages.map((p, i) => {
        if (i !== state.activePage) return p;
        return {
          ...p,
          elements: p.elements.map(el =>
            el.id === action.id
              ? { ...el, style: { ...el.style, left: action.left, top: action.top } }
              : el
          ),
        };
      });
      return {
        ...state,
        pages,
        history: [...state.history.slice(-MAX_HISTORY), snapshot],
        future: [],
      };
    }

    case 'BULK_MOVE': {
      // nudge all selected elements by dx/dy pixels; no history spam (use NUDGE_COMMIT for that)
      const pages = state.pages.map((p, i) => {
        if (i !== state.activePage) return p;
        const ids = new Set(action.ids);
        return {
          ...p,
          elements: p.elements.map(el => {
            if (!ids.has(el.id)) return el;
            const curLeft = parseInt(el.style?.left) || 0;
            const curTop = parseInt(el.style?.top) || 0;
            return { ...el, style: { ...el.style, left: `${curLeft + action.dx}px`, top: `${curTop + action.dy}px` } };
          }),
        };
      });
      return { ...state, pages };
    }

    case 'BULK_MOVE_COMMIT': {
      // same as BULK_MOVE but also saves to history
      const snapshot = JSON.parse(JSON.stringify(state.pages));
      const pages = state.pages.map((p, i) => {
        if (i !== state.activePage) return p;
        const ids = new Set(action.ids);
        return {
          ...p,
          elements: p.elements.map(el => {
            if (!ids.has(el.id)) return el;
            const curLeft = parseInt(el.style?.left) || 0;
            const curTop = parseInt(el.style?.top) || 0;
            return { ...el, style: { ...el.style, left: `${curLeft + action.dx}px`, top: `${curTop + action.dy}px` } };
          }),
        };
      });
      return {
        ...state,
        pages,
        history: [...state.history.slice(-MAX_HISTORY), snapshot],
        future: [],
      };
    }

    case 'CHANGE_ZINDEX': {
      const snapshot = JSON.parse(JSON.stringify(state.pages));
      const ids = new Set(action.ids);
      const delta = action.delta; // +1 or -1
      const pages = state.pages.map((p, i) => {
        if (i !== state.activePage) return p;
        return {
          ...p,
          elements: p.elements.map(el => {
            if (!ids.has(el.id)) return el;
            const cur = parseInt(el.style?.zIndex) || 1;
            return { ...el, style: { ...el.style, zIndex: Math.max(1, cur + delta) } };
          }),
        };
      });
      return {
        ...state,
        pages,
        history: [...state.history.slice(-MAX_HISTORY), snapshot],
        future: [],
      };
    }

    case 'COPY_ELEMENTS': {
      const page = state.pages[state.activePage];
      const ids = new Set(action.ids);
      const copied = (page?.elements || []).filter(el => ids.has(el.id));
      return { ...state, clipboardElements: copied };
    }

    case 'PASTE_ELEMENTS': {
      if (!state.clipboardElements.length) return state;
      const snapshot = JSON.parse(JSON.stringify(state.pages));
      const offset = action.offset || 20;
      const newEls = state.clipboardElements.map(el => ({
        ...JSON.parse(JSON.stringify(el)),
        id: uuidv4(),
        style: {
          ...el.style,
          left: `${(parseInt(el.style?.left) || 0) + offset}px`,
          top: `${(parseInt(el.style?.top) || 0) + offset}px`,
        },
      }));
      const newIds = newEls.map(e => e.id);
      const pages = state.pages.map((p, i) =>
        i === state.activePage ? { ...p, elements: [...p.elements, ...newEls] } : p
      );
      return {
        ...state,
        pages,
        selectedIds: newIds,
        selectedId: newIds[newIds.length - 1] || null,
        history: [...state.history.slice(-MAX_HISTORY), snapshot],
        future: [],
      };
    }

    case 'UNDO': {
      if (state.history.length === 0) return state;
      const prev = state.history[state.history.length - 1];
      return {
        ...state,
        pages: prev,
        history: state.history.slice(0, -1),
        future: [JSON.parse(JSON.stringify(state.pages)), ...state.future],
        selectedId: null,
        selectedIds: [],
      };
    }

    case 'REDO': {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      return {
        ...state,
        pages: next,
        history: [...state.history, JSON.parse(JSON.stringify(state.pages))],
        future: state.future.slice(1),
        selectedId: null,
        selectedIds: [],
      };
    }

    case 'ADD_PAGE': {
      const newPage = { id: uuidv4(), name: `Page ${state.pages.length + 1}`, elements: [], background: { type: 'solid', value: '#050508' } };
      return { ...state, pages: [...state.pages, newPage], activePage: state.pages.length };
    }

    case 'ADD_PAGE_WITH_ELEMENTS': {
      const snapshot = JSON.parse(JSON.stringify(state.pages));
      const newPage = {
        id: uuidv4(),
        name: action.name || 'AI Page',
        elements: action.elements || [],
        background: action.background || { type: 'solid', value: '#050508' },
      };
      return {
        ...state,
        pages: [...state.pages, newPage],
        activePage: state.pages.length,
        selectedId: null,
        selectedIds: [],
        history: [...state.history.slice(-MAX_HISTORY), snapshot],
        future: [],
      };
    }

    case 'DELETE_PAGE': {
      if (state.pages.length <= 1) return state; // can't delete last page
      const snapshot = JSON.parse(JSON.stringify(state.pages));
      const newPages = state.pages.filter((_, i) => i !== action.index);
      const newActive = action.index >= newPages.length ? newPages.length - 1 : action.index;
      return {
        ...state,
        pages: newPages,
        activePage: newActive,
        selectedId: null,
        selectedIds: [],
        history: [...state.history.slice(-MAX_HISTORY), snapshot],
        future: [],
      };
    }

    case 'SET_PAGE_NAME': {
      const pages = state.pages.map((p, i) =>
        i === action.index ? { ...p, name: action.name } : p
      );
      return { ...state, pages };
    }

    case 'ADD_CUSTOM_FONT':
      return { ...state, customFonts: [...state.customFonts, action.font] };

    case 'REMOVE_CUSTOM_FONT':
      return { ...state, customFonts: state.customFonts.filter(f => f.name !== action.name) };

    // ── Chatbot edit actions ────────────────────────────────────
    case 'SET_BACKGROUND': {
      const snapshot = JSON.parse(JSON.stringify(state.pages));
      const pages = state.pages.map((p, i) =>
        i === state.activePage ? { ...p, background: action.background } : p
      );
      return { ...state, pages, history: [...state.history.slice(-MAX_HISTORY), snapshot], future: [] };
    }

    case 'ADD_ELEMENTS': {
      const snapshot = JSON.parse(JSON.stringify(state.pages));
      const pages = state.pages.map((p, i) =>
        i === state.activePage
          ? { ...p, elements: [...(p.elements || []), ...(action.elements || []).map(e => ({ ...e, id: uuidv4() }))] }
          : p
      );
      return { ...state, pages, history: [...state.history.slice(-MAX_HISTORY), snapshot], future: [] };
    }

    case 'REPLACE_ELEMENTS': {
      const snapshot = JSON.parse(JSON.stringify(state.pages));
      const pages = state.pages.map((p, i) =>
        i === state.activePage
          ? { ...p, elements: (action.elements || []).map(e => ({ ...e, id: uuidv4() })) }
          : p
      );
      return { ...state, pages, selectedId: null, selectedIds: [], history: [...state.history.slice(-MAX_HISTORY), snapshot], future: [] };
    }

    case 'UPDATE_ELEMENTS_MATCHING': {
      // Match by type and/or label substring, then deep-merge props/style
      const snapshot = JSON.parse(JSON.stringify(state.pages));
      const pages = state.pages.map((p, i) => {
        if (i !== state.activePage) return p;
        return {
          ...p,
          elements: p.elements.map(el => {
            const typeMatch = !action.matchType || el.type === action.matchType;
            const labelMatch = !action.matchLabel ||
              (el.label || '').toLowerCase().includes(action.matchLabel.toLowerCase());
            if (!typeMatch || !labelMatch) return el;
            return {
              ...el,
              style: action.style ? deepMerge(el.style || {}, action.style) : el.style,
              props: action.props ? deepMerge(el.props || {}, action.props) : el.props,
            };
          }),
        };
      });
      return { ...state, pages, history: [...state.history.slice(-MAX_HISTORY), snapshot], future: [] };
    }

    case 'REMOVE_ELEMENTS_MATCHING': {
      const snapshot = JSON.parse(JSON.stringify(state.pages));
      const pages = state.pages.map((p, i) => {
        if (i !== state.activePage) return p;
        return {
          ...p,
          elements: p.elements.filter(el => {
            const typeMatch = !action.matchType || el.type === action.matchType;
            const labelMatch = !action.matchLabel ||
              (el.label || '').toLowerCase().includes(action.matchLabel.toLowerCase());
            return !(typeMatch && labelMatch);
          }),
        };
      });
      return { ...state, pages, selectedId: null, selectedIds: [], history: [...state.history.slice(-MAX_HISTORY), snapshot], future: [] };
    }

    default:
      return state;
  }
}

function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

export function BuilderProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const selectElement = useCallback((id) => dispatch({ type: 'SELECT_ELEMENT', id }), []);
  const deselect = useCallback(() => dispatch({ type: 'DESELECT' }), []);
  const toggleSelect = useCallback((id) => dispatch({ type: 'TOGGLE_SELECT', id }), []);
  const selectMany = useCallback((ids) => dispatch({ type: 'SELECT_MANY', ids }), []);
  const selectAll = useCallback(() => dispatch({ type: 'SELECT_ALL' }), []);
  const switchPage = useCallback((index) => dispatch({ type: 'SWITCH_PAGE', index }), []);
  const setViewport = useCallback((viewport) => dispatch({ type: 'SET_VIEWPORT', viewport }), []);
  const togglePreview = useCallback(() => dispatch({ type: 'TOGGLE_PREVIEW' }), []);
  const addElement = useCallback((element) => dispatch({ type: 'ADD_ELEMENT', element }), []);
  const updateElement = useCallback((id, updates) => dispatch({ type: 'UPDATE_ELEMENT', id, updates }), []);
  const bulkUpdate = useCallback((ids, updates) => dispatch({ type: 'BULK_UPDATE', ids, updates }), []);
  const deleteElement = useCallback((id) => dispatch({ type: 'DELETE_ELEMENT', id }), []);
  const bulkDelete = useCallback((ids) => dispatch({ type: 'BULK_DELETE', ids }), []);
  const moveElement = useCallback((id, left, top) => dispatch({ type: 'MOVE_ELEMENT', id, left, top }), []);
  const bulkMove = useCallback((ids, dx, dy) => dispatch({ type: 'BULK_MOVE', ids, dx, dy }), []);
  const bulkMoveCommit = useCallback((ids, dx, dy) => dispatch({ type: 'BULK_MOVE_COMMIT', ids, dx, dy }), []);
  const changeZIndex = useCallback((ids, delta) => dispatch({ type: 'CHANGE_ZINDEX', ids, delta }), []);
  const copyElements = useCallback((ids) => dispatch({ type: 'COPY_ELEMENTS', ids }), []);
  const pasteElements = useCallback((offset) => dispatch({ type: 'PASTE_ELEMENTS', offset }), []);
  const reorderElements = useCallback((elements) => dispatch({ type: 'REORDER_ELEMENTS', elements }), []);
  const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);
  const redo = useCallback(() => dispatch({ type: 'REDO' }), []);
  const addPage = useCallback(() => dispatch({ type: 'ADD_PAGE' }), []);
  const addPageWithElements = useCallback((name, elements, background) => dispatch({ type: 'ADD_PAGE_WITH_ELEMENTS', name, elements, background }), []);
  const deletePage = useCallback((index) => dispatch({ type: 'DELETE_PAGE', index }), []);
  const setPageName = useCallback((index, name) => dispatch({ type: 'SET_PAGE_NAME', index, name }), []);
  const addCustomFont = useCallback((font) => dispatch({ type: 'ADD_CUSTOM_FONT', font }), []);
  const removeCustomFont = useCallback((name) => dispatch({ type: 'REMOVE_CUSTOM_FONT', name }), []);
  // Chatbot edit actions
  const setBackground = useCallback((background) => dispatch({ type: 'SET_BACKGROUND', background }), []);
  const addElements = useCallback((elements) => dispatch({ type: 'ADD_ELEMENTS', elements }), []);
  const replaceElements = useCallback((elements) => dispatch({ type: 'REPLACE_ELEMENTS', elements }), []);
  const updateElementsMatching = useCallback((matchType, matchLabel, props, style) =>
    dispatch({ type: 'UPDATE_ELEMENTS_MATCHING', matchType, matchLabel, props, style }), []);
  const removeElementsMatching = useCallback((matchType, matchLabel) =>
    dispatch({ type: 'REMOVE_ELEMENTS_MATCHING', matchType, matchLabel }), []);

  const currentPage = state.pages[state.activePage];
  const selectedElement = currentPage?.elements?.find(el => el.id === state.selectedId) || null;
  const selectedElements = (currentPage?.elements || []).filter(el => state.selectedIds.includes(el.id));

  return (
    <BuilderContext.Provider value={{
      ...state,
      currentPage,
      selectedElement,
      selectedElements,
      selectElement,
      deselect,
      toggleSelect,
      selectMany,
      selectAll,
      switchPage,
      setViewport,
      togglePreview,
      addElement,
      updateElement,
      bulkUpdate,
      deleteElement,
      bulkDelete,
      moveElement,
      bulkMove,
      bulkMoveCommit,
      changeZIndex,
      copyElements,
      pasteElements,
      reorderElements,
      undo,
      redo,
      addPage,
      addPageWithElements,
      deletePage,
      setPageName,
      addCustomFont,
      removeCustomFont,
      setBackground,
      addElements,
      replaceElements,
      updateElementsMatching,
      removeElementsMatching,
      canUndo: state.history.length > 0,
      canRedo: state.future.length > 0,
    }}>
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const ctx = useContext(BuilderContext);
  if (!ctx) throw new Error('useBuilder must be used within BuilderProvider');
  return ctx;
}
