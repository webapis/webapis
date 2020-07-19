import {
  h,
  createContext,
} from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  useReducer,
  useMemo,
  useContext,
  useState,
  useEffect,
} from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/hooks.module.js";
import reducer, { initState } from "./reducer";
import actionTypes from "./actionTypes";
import List, { ListItem } from "controls/list";

const AccordionContext = createContext();

export default function Accordions(props) {
  const { selectedId, name } = props;
  const [state, dispatch] = useReducer(reducer, {
    ...initState,
    selectedId,
    name,
  });
  useEffect(() => {
    if (name && localStorage.getItem(`accordion-${name}`)) {
      const { selectedId } = JSON.parse(
        localStorage.getItem(`accordion-${name}`)
      );

      dispatch({ type: actionTypes.ACCORDION_SELECTED, selectedId });
    }
  }, []);
  const value = useMemo(() => [state, dispatch], [state]);
  return <AccordionContext.Provider value={value} {...props} />;
}
//
export function Accordion({ children, title, id }) {
  const [state, dispatch] = useContext(AccordionContext);
  const [visible, setVisible] = useState(false);

  const { selectedId, name } = state;

  useEffect(() => {
    if (selectedId === id) {
      setVisible(true);
    }
  }, []);

  function selectAccordion(e) {
    const id = e.target.id;

    if (id !== selectedId) {
      setVisible(true);
    } else {
      setVisible((prev) => !prev);
    }
    if (name) {
      localStorage.setItem(
        `accordion-${name}`,
        JSON.stringify({ selectedId: id })
      );
    }
    dispatch({ type: actionTypes.ACCORDION_SELECTED, selectedId: id });
  }

  return (
    <List
      style={{
        backgroundColor: "#eeeeee",
        padding: 3,
        flex: 1,
        marginBottom: 3,
      }}
    >
      <ListItem id={id} onClick={selectAccordion} style={{ fontWeight: 900 }}>
        {title}
      </ListItem>

      {selectedId === id && visible && children}
    </List>
  );
}
