import { h, _ as _extends, m, p, u as useAuthContext, v, B as ListItem, C as List } from './index-ca5036af.js';
import { a as useContactsContext, s as selectContact } from './index-7465321c.js';
import { u as useContacts } from './mobile-28876661.js';

const style = {
  padding: 8,
  marginLeft: 16,
  marginRight: 16,
  marginTop: 8,
  marginBottom: 8,
  boxSizing: 'border-box',
  flex: 1
};
function TextInput(props) {
  const {
    id,
    type = 'text'
  } = props;
  return h("div", {
    style: {
      display: 'flex',
      width: '100%'
    }
  }, h("input", _extends({
    style: style
  }, props, {
    "data-testid": id,
    type: type
  })));
}

const initState = {
  users: [],
  loading: false,
  error: null
};
const actionTypes = {
  FETCH_USERS_STARTED: 'FETCH_USERS_STARTED',
  FETCH_USERS_SUCCESS: 'FETCH_USERS_SUCCESS',
  FETCH_USERS_FAILED: 'FETCH_USERS_FAILED'
};

async function fetchUsers({
  dispatch,
  filter
}) {
  try {
    dispatch({
      type: actionTypes.FETCH_USERS_STARTED
    });
    const response = await fetch(`/users/find?filter=${filter}`);
    const {
      users
    } = await response.json();
    debugger;
    dispatch({
      type: actionTypes.FETCH_USERS_SUCCESS,
      users
    });
  } catch (error) {
    dispatch({
      type: actionTypes.FETCH_USERS_FAILED,
      error
    });
  }
}

function usersReducer(state, action) {
  switch (action.type) {
    case actionTypes.FETCH_USERS_STARTED:
      return { ...state,
        loading: true
      };

    case actionTypes.FETCH_USERS_SUCCESS:
      const nextState = { ...state,
        users: action.users.map(user => {
          return { ...user,
            state: 'invite'
          };
        })
      };
      debugger;
      return nextState;

    case actionTypes.FETCH_USERS_FAILED:
      return { ...state,
        error: action.error
      };

    default:
      return state;
  }
}

function useUsers({
  filter
}) {
  const [state, dispatch] = m(usersReducer, initState);
  p(() => {
    if (filter && filter.length > 3) {
      fetchUsers({
        dispatch,
        filter
      });
    }
  }, [filter]);
  return {
    state
  };
}

function Contacts() {
  const [state, dispatch] = useContactsContext();
  const {
    state: authState
  } = useAuthContext();
  const [contactsfilter, setContactsFilter] = v(null);
  const [usersFilter, setUsersFilter] = v(null);
  const [items, setItems] = v([]);
  const {
    state: contactState
  } = useContacts({
    filter: contactsfilter,
    username: authState.username
  });
  const {
    state: userState
  } = useUsers({
    filter: usersFilter
  });

  function handleSearch(e) {
    const {
      value
    } = e.target;
    setContactsFilter(value);
  }

  p(() => {
    if (contactState.contacts.length > 0) {
      setItems(contactState.contacts);
    }
  }, [contactState]);
  p(() => {
    if (contactsfilter && contactState.contacts.length === 0) {
      setUsersFilter(contactsfilter);
    }

    if (contactsfilter && contactState.contacts.length > 0) {
      setItems(contactState.contacts);
    }
  }, [contactState.contacts, contactsfilter]);
  p(() => {
    if (usersFilter && userState.users.length > 0) {
      debugger;
      setItems(userState.users);
    }
  }, [userState.users, usersFilter]);

  function handleItemClick(e) {
    const selectedContact = items.find(item => item.username === e.target.id);
    debugger;
    selectContact({
      dispatch,
      contact: selectedContact
    });
  }

  return h("div", null, h(TextInput, {
    id: "contact-search",
    onChange: handleSearch,
    placeholder: "Enter username, or email"
  }), h(List, {
    id: "contacts-list"
  }, items.length > 0 && items.map(item => {
    return h(ListItem, {
      onClick: handleItemClick,
      id: item.username
    }, item.username);
  })));
}

export default Contacts;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udGFjdHMtMmVlNjViZDUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9sYXlvdXQvVGV4dElucHV0LmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL2NvbnRhY3RzL3VzZVVzZXJzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL2NvbnRhY3RzL0NvbnRhY3RzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgcGFkZGluZzogOCxcclxuICBtYXJnaW5MZWZ0OiAxNixcclxuICBtYXJnaW5SaWdodDogMTYsXHJcbiAgbWFyZ2luVG9wOiA4LFxyXG4gIG1hcmdpbkJvdHRvbTogOCxcclxuICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcclxuICBmbGV4OiAxLFxyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFRleHRJbnB1dChwcm9wcykge1xyXG4gIGNvbnN0IHsgaWQsIHR5cGUgPSAndGV4dCcgfSA9IHByb3BzO1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4Jywgd2lkdGg6ICcxMDAlJyB9fT5cclxuICAgICAgPGlucHV0IHN0eWxlPXtzdHlsZX0gey4uLnByb3BzfSBkYXRhLXRlc3RpZD17aWR9IHR5cGU9e3R5cGV9IC8+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IHVzZVJlZHVjZXIsIHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcblxyXG5jb25zdCBpbml0U3RhdGUgPSB7XHJcbiAgdXNlcnM6IFtdLFxyXG4gIGxvYWRpbmc6IGZhbHNlLFxyXG4gIGVycm9yOiBudWxsLFxyXG59O1xyXG5jb25zdCBhY3Rpb25UeXBlcyA9IHtcclxuICBGRVRDSF9VU0VSU19TVEFSVEVEOiAnRkVUQ0hfVVNFUlNfU1RBUlRFRCcsXHJcbiAgRkVUQ0hfVVNFUlNfU1VDQ0VTUzogJ0ZFVENIX1VTRVJTX1NVQ0NFU1MnLFxyXG4gIEZFVENIX1VTRVJTX0ZBSUxFRDogJ0ZFVENIX1VTRVJTX0ZBSUxFRCcsXHJcbn07XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmZXRjaFVzZXJzKHsgZGlzcGF0Y2gsIGZpbHRlciB9KSB7XHJcbiAgdHJ5IHtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUlNfU1RBUlRFRCB9KTtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC91c2Vycy9maW5kP2ZpbHRlcj0ke2ZpbHRlcn1gKTtcclxuICAgIGNvbnN0IHsgdXNlcnMgfSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgIGRlYnVnZ2VyO1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSU19TVUNDRVNTLCB1c2VycyB9KTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSU19GQUlMRUQsIGVycm9yIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gdXNlcnNSZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcclxuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX1VTRVJTX1NUQVJURUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX1VTRVJTX1NVQ0NFU1M6XHJcbiAgICAgIGNvbnN0IG5leHRTdGF0ZSA9IHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICB1c2VyczogYWN0aW9uLnVzZXJzLm1hcCgodXNlcikgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIHsgLi4udXNlciwgc3RhdGU6ICdpbnZpdGUnIH07XHJcbiAgICAgICAgfSksXHJcbiAgICAgIH07XHJcbiAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICByZXR1cm4gbmV4dFN0YXRlO1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSU19GQUlMRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBlcnJvcjogYWN0aW9uLmVycm9yIH07XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gc3RhdGU7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlVXNlcnMoeyBmaWx0ZXIgfSkge1xyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcih1c2Vyc1JlZHVjZXIsIGluaXRTdGF0ZSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoZmlsdGVyICYmIGZpbHRlci5sZW5ndGggPiAzKSB7XHJcbiAgICAgIGZldGNoVXNlcnMoeyBkaXNwYXRjaCwgZmlsdGVyIH0pO1xyXG4gICAgfVxyXG4gIH0sIFtmaWx0ZXJdKTtcclxuXHJcbiAgcmV0dXJuIHsgc3RhdGUgfTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IExpc3QsIExpc3RJdGVtIH0gZnJvbSAnLi4vLi4vbGF5b3V0L05hdkxpc3QnO1xyXG5pbXBvcnQgeyBUZXh0SW5wdXQgfSBmcm9tICcuLi8uLi9sYXlvdXQvVGV4dElucHV0JztcclxuaW1wb3J0IHsgdXNlQ29udGFjdHMgfSBmcm9tICcuL3VzZUNvbnRhY3RzJztcclxuaW1wb3J0IHsgdXNlVXNlcnMgfSBmcm9tICcuL3VzZVVzZXJzJztcclxuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuLi8uLi9hdXRoL2F1dGgtY29udGV4dCc7XHJcbmltcG9ydCB7IHVzZUNvbnRhY3RzQ29udGV4dCwgc2VsZWN0Q29udGFjdCB9IGZyb20gJy4vY29udGFjdC1jb250ZXh0JztcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ29udGFjdHMoKSB7XHJcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VDb250YWN0c0NvbnRleHQoKTtcclxuICBjb25zdCB7IHN0YXRlOiBhdXRoU3RhdGUgfSA9IHVzZUF1dGhDb250ZXh0KCk7XHJcbiAgY29uc3QgW2NvbnRhY3RzZmlsdGVyLCBzZXRDb250YWN0c0ZpbHRlcl0gPSB1c2VTdGF0ZShudWxsKTtcclxuICBjb25zdCBbdXNlcnNGaWx0ZXIsIHNldFVzZXJzRmlsdGVyXSA9IHVzZVN0YXRlKG51bGwpO1xyXG4gIGNvbnN0IFtpdGVtcywgc2V0SXRlbXNdID0gdXNlU3RhdGUoW10pO1xyXG4gIGNvbnN0IHsgc3RhdGU6IGNvbnRhY3RTdGF0ZSB9ID0gdXNlQ29udGFjdHMoe1xyXG4gICAgZmlsdGVyOiBjb250YWN0c2ZpbHRlcixcclxuICAgIHVzZXJuYW1lOiBhdXRoU3RhdGUudXNlcm5hbWUsXHJcbiAgfSk7XHJcbiAgY29uc3QgeyBzdGF0ZTogdXNlclN0YXRlIH0gPSB1c2VVc2Vycyh7IGZpbHRlcjogdXNlcnNGaWx0ZXIgfSk7XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZVNlYXJjaChlKSB7XHJcbiAgICBjb25zdCB7IHZhbHVlIH0gPSBlLnRhcmdldDtcclxuICAgIHNldENvbnRhY3RzRmlsdGVyKHZhbHVlKTtcclxuICB9XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoY29udGFjdFN0YXRlLmNvbnRhY3RzLmxlbmd0aCA+IDApIHtcclxuICAgICAgc2V0SXRlbXMoY29udGFjdFN0YXRlLmNvbnRhY3RzKTtcclxuICAgIH1cclxuICB9LCBbY29udGFjdFN0YXRlXSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoY29udGFjdHNmaWx0ZXIgJiYgY29udGFjdFN0YXRlLmNvbnRhY3RzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICBzZXRVc2Vyc0ZpbHRlcihjb250YWN0c2ZpbHRlcik7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNvbnRhY3RzZmlsdGVyICYmIGNvbnRhY3RTdGF0ZS5jb250YWN0cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHNldEl0ZW1zKGNvbnRhY3RTdGF0ZS5jb250YWN0cyk7XHJcbiAgICB9XHJcbiAgfSwgW2NvbnRhY3RTdGF0ZS5jb250YWN0cywgY29udGFjdHNmaWx0ZXJdKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmICh1c2Vyc0ZpbHRlciAmJiB1c2VyU3RhdGUudXNlcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICBkZWJ1Z2dlcjtcclxuICAgICAgc2V0SXRlbXModXNlclN0YXRlLnVzZXJzKTtcclxuICAgIH1cclxuICB9LCBbdXNlclN0YXRlLnVzZXJzLCB1c2Vyc0ZpbHRlcl0pO1xyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVJdGVtQ2xpY2soZSkge1xyXG4gICAgY29uc3Qgc2VsZWN0ZWRDb250YWN0ID0gaXRlbXMuZmluZCgoaXRlbSkgPT4gaXRlbS51c2VybmFtZSA9PT0gZS50YXJnZXQuaWQpO1xyXG4gICAgZGVidWdnZXI7XHJcbiAgICBzZWxlY3RDb250YWN0KHsgZGlzcGF0Y2gsIGNvbnRhY3Q6IHNlbGVjdGVkQ29udGFjdCB9KTtcclxuICB9XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2PlxyXG4gICAgICA8VGV4dElucHV0XHJcbiAgICAgICAgaWQ9J2NvbnRhY3Qtc2VhcmNoJ1xyXG4gICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVTZWFyY2h9XHJcbiAgICAgICAgcGxhY2Vob2xkZXI9J0VudGVyIHVzZXJuYW1lLCBvciBlbWFpbCdcclxuICAgICAgLz5cclxuICAgICAgPExpc3QgaWQ9J2NvbnRhY3RzLWxpc3QnPlxyXG4gICAgICAgIHtpdGVtcy5sZW5ndGggPiAwICYmXHJcbiAgICAgICAgICBpdGVtcy5tYXAoKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICA8TGlzdEl0ZW0gb25DbGljaz17aGFuZGxlSXRlbUNsaWNrfSBpZD17aXRlbS51c2VybmFtZX0+XHJcbiAgICAgICAgICAgICAgICB7aXRlbS51c2VybmFtZX1cclxuICAgICAgICAgICAgICA8L0xpc3RJdGVtPlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgfSl9XHJcbiAgICAgIDwvTGlzdD5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIl0sIm5hbWVzIjpbInN0eWxlIiwicGFkZGluZyIsIm1hcmdpbkxlZnQiLCJtYXJnaW5SaWdodCIsIm1hcmdpblRvcCIsIm1hcmdpbkJvdHRvbSIsImJveFNpemluZyIsImZsZXgiLCJUZXh0SW5wdXQiLCJwcm9wcyIsImlkIiwidHlwZSIsImRpc3BsYXkiLCJ3aWR0aCIsImluaXRTdGF0ZSIsInVzZXJzIiwibG9hZGluZyIsImVycm9yIiwiYWN0aW9uVHlwZXMiLCJGRVRDSF9VU0VSU19TVEFSVEVEIiwiRkVUQ0hfVVNFUlNfU1VDQ0VTUyIsIkZFVENIX1VTRVJTX0ZBSUxFRCIsImZldGNoVXNlcnMiLCJkaXNwYXRjaCIsImZpbHRlciIsInJlc3BvbnNlIiwiZmV0Y2giLCJqc29uIiwidXNlcnNSZWR1Y2VyIiwic3RhdGUiLCJhY3Rpb24iLCJuZXh0U3RhdGUiLCJtYXAiLCJ1c2VyIiwidXNlVXNlcnMiLCJ1c2VSZWR1Y2VyIiwidXNlRWZmZWN0IiwibGVuZ3RoIiwiQ29udGFjdHMiLCJ1c2VDb250YWN0c0NvbnRleHQiLCJhdXRoU3RhdGUiLCJ1c2VBdXRoQ29udGV4dCIsImNvbnRhY3RzZmlsdGVyIiwic2V0Q29udGFjdHNGaWx0ZXIiLCJ1c2VTdGF0ZSIsInVzZXJzRmlsdGVyIiwic2V0VXNlcnNGaWx0ZXIiLCJpdGVtcyIsInNldEl0ZW1zIiwiY29udGFjdFN0YXRlIiwidXNlQ29udGFjdHMiLCJ1c2VybmFtZSIsInVzZXJTdGF0ZSIsImhhbmRsZVNlYXJjaCIsImUiLCJ2YWx1ZSIsInRhcmdldCIsImNvbnRhY3RzIiwiaGFuZGxlSXRlbUNsaWNrIiwic2VsZWN0ZWRDb250YWN0IiwiZmluZCIsIml0ZW0iLCJzZWxlY3RDb250YWN0IiwiY29udGFjdCJdLCJtYXBwaW5ncyI6Ijs7OztBQUVBLE1BQU1BLEtBQUssR0FBRztBQUNaQyxFQUFBQSxPQUFPLEVBQUUsQ0FERztBQUVaQyxFQUFBQSxVQUFVLEVBQUUsRUFGQTtBQUdaQyxFQUFBQSxXQUFXLEVBQUUsRUFIRDtBQUlaQyxFQUFBQSxTQUFTLEVBQUUsQ0FKQztBQUtaQyxFQUFBQSxZQUFZLEVBQUUsQ0FMRjtBQU1aQyxFQUFBQSxTQUFTLEVBQUUsWUFOQztBQU9aQyxFQUFBQSxJQUFJLEVBQUU7QUFQTSxDQUFkO0FBVU8sU0FBU0MsU0FBVCxDQUFtQkMsS0FBbkIsRUFBMEI7QUFDL0IsUUFBTTtBQUFFQyxJQUFBQSxFQUFGO0FBQU1DLElBQUFBLElBQUksR0FBRztBQUFiLE1BQXdCRixLQUE5QjtBQUNBLFNBQ0U7QUFBSyxJQUFBLEtBQUssRUFBRTtBQUFFRyxNQUFBQSxPQUFPLEVBQUUsTUFBWDtBQUFtQkMsTUFBQUEsS0FBSyxFQUFFO0FBQTFCO0FBQVosS0FDRTtBQUFPLElBQUEsS0FBSyxFQUFFYjtBQUFkLEtBQXlCUyxLQUF6QjtBQUFnQyxtQkFBYUMsRUFBN0M7QUFBaUQsSUFBQSxJQUFJLEVBQUVDO0FBQXZELEtBREYsQ0FERjtBQUtEOztBQ2pCRCxNQUFNRyxTQUFTLEdBQUc7QUFDaEJDLEVBQUFBLEtBQUssRUFBRSxFQURTO0FBRWhCQyxFQUFBQSxPQUFPLEVBQUUsS0FGTztBQUdoQkMsRUFBQUEsS0FBSyxFQUFFO0FBSFMsQ0FBbEI7QUFLQSxNQUFNQyxXQUFXLEdBQUc7QUFDbEJDLEVBQUFBLG1CQUFtQixFQUFFLHFCQURIO0FBRWxCQyxFQUFBQSxtQkFBbUIsRUFBRSxxQkFGSDtBQUdsQkMsRUFBQUEsa0JBQWtCLEVBQUU7QUFIRixDQUFwQjs7QUFNQSxlQUFlQyxVQUFmLENBQTBCO0FBQUVDLEVBQUFBLFFBQUY7QUFBWUMsRUFBQUE7QUFBWixD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
