import { d as useAuthRouteContext, a as useMediaQuery, e as useAuthContext, f as useFormContext, p, h, v as validationTypes, y as forgotPassword, g as valueChanged } from './index-a6321377.js';
import { I as Input, F as Form, P as Paper, G as Grid } from './Grid-13a5ec1f.js';
import { B as Button } from './Button-5bcacdea.js';
import './style-b6a34b09.js';

function RequestPassChange() {
  const [authRoute, setAuthRoute] = useAuthRouteContext();
  const {
    device
  } = useMediaQuery();
  const {
    dispatch,
    state
  } = useAuthContext();
  const {
    dispatch: formDispatch
  } = useFormContext();
  const {
    email
  } = state;

  function handleForgotPassword() {
    dispatch(forgotPassword({
      dispatch,
      state,
      formDispatch
    }));
  }

  function handleChange(e) {
    const {
      name,
      value
    } = e.target;
    dispatch(valueChanged({
      propName: name,
      value,
      dispatch,
      state
    }));
  }

  p(() => {
    if (state.authFeedback) {
      debugger;
      setAuthRoute('/authfeedback');
    }
  }, [state.authFeedback]);
  return h(Grid, {
    width: device === 'phone' ? 100 : 25
  }, h(Paper, null, h(Form, {
    formTitle: "Forgot Password"
  }, h(Input, {
    value: email,
    placeholder: "email",
    name: "email",
    onChange: handleChange,
    type: "email",
    id: "email",
    validationTypes: [validationTypes.EMAIL_FORMAT_VALIDATION, validationTypes.EMAIL_NOT_REGISTERED]
  }), h(Button, {
    className: "btn",
    type: "button",
    onClick: handleForgotPassword,
    id: "requestpasschange-btn",
    title: "Send"
  }))));
}

export default RequestPassChange;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9yZ290UGFzc3dvcmQtNWVkZWU1NTEuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9hdXRoL0ZvcmdvdFBhc3N3b3JkLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgSW5wdXQgZnJvbSAnLi4vZm9ybS9JbnB1dCc7XHJcbmltcG9ydCBGb3JtIGZyb20gJy4uL2Zvcm0vRm9ybSc7XHJcbmltcG9ydCBCdXR0b24gZnJvbSAnLi4vZm9ybS9CdXR0b24nO1xyXG5pbXBvcnQgdmFsaWRhdGlvblR5cGVzIGZyb20gJy4uL2Zvcm0vdmFsaWRhdGlvblR5cGVzJztcclxuaW1wb3J0ICcuL2Nzcy9zdHlsZS5jc3MnO1xyXG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4vYXV0aC1jb250ZXh0JztcclxuaW1wb3J0IHsgdXNlRm9ybUNvbnRleHQgfSBmcm9tICcuLi9mb3JtL2Zvcm0tY29udGV4dCc7XHJcbmltcG9ydCAqIGFzIGFjdGlvbnMgZnJvbSAnLi9hY3Rpb25zJztcclxuaW1wb3J0IHsgdXNlTWVkaWFRdWVyeSB9IGZyb20gJy4uL2xheW91dC91c2VNZWRpYVF1ZXJ5JztcclxuaW1wb3J0IHsgUGFwZXIgfSBmcm9tICcuLi9sYXlvdXQvUGFwZXInO1xyXG5pbXBvcnQgeyBHcmlkIH0gZnJvbSAnLi4vbGF5b3V0L0dyaWQnO1xyXG5cclxuaW1wb3J0IHsgdXNlQXV0aFJvdXRlQ29udGV4dCB9IGZyb20gJy4vYXV0aC1yb3V0ZS1jb250ZXh0JztcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gUmVxdWVzdFBhc3NDaGFuZ2UoKSB7XHJcbiAgY29uc3QgW2F1dGhSb3V0ZSwgc2V0QXV0aFJvdXRlXSA9IHVzZUF1dGhSb3V0ZUNvbnRleHQoKTtcclxuICBjb25zdCB7IGRldmljZSB9ID0gdXNlTWVkaWFRdWVyeSgpO1xyXG4gIGNvbnN0IHsgZGlzcGF0Y2gsIHN0YXRlIH0gPSB1c2VBdXRoQ29udGV4dCgpO1xyXG4gIGNvbnN0IHsgZGlzcGF0Y2g6IGZvcm1EaXNwYXRjaCB9ID0gdXNlRm9ybUNvbnRleHQoKTtcclxuICBjb25zdCB7IGVtYWlsIH0gPSBzdGF0ZTtcclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlRm9yZ290UGFzc3dvcmQoKSB7XHJcbiAgICBkaXNwYXRjaChhY3Rpb25zLmZvcmdvdFBhc3N3b3JkKHsgZGlzcGF0Y2gsIHN0YXRlLCBmb3JtRGlzcGF0Y2ggfSkpO1xyXG4gIH1cclxuICBmdW5jdGlvbiBoYW5kbGVDaGFuZ2UoZSkge1xyXG4gICAgY29uc3QgeyBuYW1lLCB2YWx1ZSB9ID0gZS50YXJnZXQ7XHJcbiAgICBkaXNwYXRjaChhY3Rpb25zLnZhbHVlQ2hhbmdlZCh7IHByb3BOYW1lOiBuYW1lLCB2YWx1ZSwgZGlzcGF0Y2gsIHN0YXRlIH0pKTtcclxuICB9XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoc3RhdGUuYXV0aEZlZWRiYWNrKSB7XHJcbiAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICBzZXRBdXRoUm91dGUoJy9hdXRoZmVlZGJhY2snKTtcclxuICAgIH1cclxuICB9LCBbc3RhdGUuYXV0aEZlZWRiYWNrXSk7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8R3JpZCB3aWR0aD17ZGV2aWNlID09PSAncGhvbmUnID8gMTAwIDogMjV9PlxyXG4gICAgICA8UGFwZXI+XHJcbiAgICAgICAgPEZvcm0gZm9ybVRpdGxlPSdGb3Jnb3QgUGFzc3dvcmQnPlxyXG4gICAgICAgICAgPElucHV0XHJcbiAgICAgICAgICAgIHZhbHVlPXtlbWFpbH1cclxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9J2VtYWlsJ1xyXG4gICAgICAgICAgICBuYW1lPSdlbWFpbCdcclxuICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cclxuICAgICAgICAgICAgdHlwZT0nZW1haWwnXHJcbiAgICAgICAgICAgIGlkPSdlbWFpbCdcclxuICAgICAgICAgICAgdmFsaWRhdGlvblR5cGVzPXtbXHJcbiAgICAgICAgICAgICAgdmFsaWRhdGlvblR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICAgICAgICAgIHZhbGlkYXRpb25UeXBlcy5FTUFJTF9OT1RfUkVHSVNURVJFRCxcclxuICAgICAgICAgICAgXX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8QnV0dG9uXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT0nYnRuJ1xyXG4gICAgICAgICAgICB0eXBlPSdidXR0b24nXHJcbiAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZUZvcmdvdFBhc3N3b3JkfVxyXG4gICAgICAgICAgICBpZD0ncmVxdWVzdHBhc3NjaGFuZ2UtYnRuJ1xyXG4gICAgICAgICAgICB0aXRsZT0nU2VuZCdcclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9Gb3JtPlxyXG4gICAgICA8L1BhcGVyPlxyXG4gICAgPC9HcmlkPlxyXG4gICk7XHJcbn1cclxuIl0sIm5hbWVzIjpbIlJlcXVlc3RQYXNzQ2hhbmdlIiwiYXV0aFJvdXRlIiwic2V0QXV0aFJvdXRlIiwidXNlQXV0aFJvdXRlQ29udGV4dCIsImRldmljZSIsInVzZU1lZGlhUXVlcnkiLCJkaXNwYXRjaCIsInN0YXRlIiwidXNlQXV0aENvbnRleHQiLCJmb3JtRGlzcGF0Y2giLCJ1c2VGb3JtQ29udGV4dCIsImVtYWlsIiwiaGFuZGxlRm9yZ290UGFzc3dvcmQiLCJhY3Rpb25zIiwiaGFuZGxlQ2hhbmdlIiwiZSIsIm5hbWUiLCJ2YWx1ZSIsInRhcmdldCIsInByb3BOYW1lIiwidXNlRWZmZWN0IiwiYXV0aEZlZWRiYWNrIiwidmFsaWRhdGlvblR5cGVzIiwiRU1BSUxfRk9STUFUX1ZBTElEQVRJT04iLCJFTUFJTF9OT1RfUkVHSVNURVJFRCJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFlZSxTQUFTQSxpQkFBVCxHQUE2QjtBQUMxQyxRQUFNLENBQUNDLFNBQUQsRUFBWUMsWUFBWixJQUE0QkMsbUJBQW1CLEVBQXJEO0FBQ0EsUUFBTTtBQUFFQyxJQUFBQTtBQUFGLE1BQWFDLGFBQWEsRUFBaEM7QUFDQSxRQUFNO0FBQUVDLElBQUFBLFFBQUY7QUFBWUMsSUFBQUE7QUFBWixNQUFzQkMsY0FBYyxFQUExQztBQUNBLFFBQU07QUFBRUYsSUFBQUEsUUFBUSxFQUFFRztBQUFaLE1BQTZCQyxjQUFjLEVBQWpEO0FBQ0EsUUFBTTtBQUFFQyxJQUFBQTtBQUFGLE1BQVlKLEtBQWxCOztBQUVBLFdBQVNLLG9CQUFULEdBQWdDO0FBQzlCTixJQUFBQSxRQUFRLENBQUNPLGNBQUEsQ0FBdUI7QUFBRVAsTUFBQUEsUUFBRjtBQUFZQyxNQUFBQSxLQUFaO0FBQW1CRSxNQUFBQTtBQUFuQixLQUF2QixDQUFELENBQVI7QUFDRDs7QUFDRCxXQUFTSyxZQUFULENBQXNCQyxDQUF0QixFQUF5QjtBQUN2QixVQUFNO0FBQUVDLE1BQUFBLElBQUY7QUFBUUMsTUFBQUE7QUFBUixRQUFrQkYsQ0FBQyxDQUFDRyxNQUExQjtBQUNBWixJQUFBQSxRQUFRLENBQUNPLFlBQUEsQ0FBcUI7QUFBRU0sTUFBQUEsUUFBUSxFQUFFSCxJQUFaO0FBQWtCQyxNQUFBQSxLQUFsQjtBQUF5QlgsTUFBQUEsUUFBekI7QUFBbUNDLE1BQUFBO0FBQW5DLEtBQXJCLENBQUQsQ0FBUjtBQUNEOztBQUVEYSxFQUFBQSxDQUFTLENBQUMsTUFBTTtBQUNkLFFBQUliLEtBQUssQ0FBQ2MsWUFBVixFQUF3QjtBQUN0QjtBQUNBbkIsTUFBQUEsWUFBWSxDQUFDLGVBQUQsQ0FBWjtBQUNEO0FBQ0YsR0FMUSxFQUtOLENBQUNLLEtBQUssQ0FBQ2MsWUFBUCxDQUxNLENBQVQ7QUFPQSxTQUNFLEVBQUMsSUFBRDtBQUFNLElBQUEsS0FBSyxFQUFFakIsTUFBTSxLQUFLLE9BQVgsR0FBcUIsR0FBckIsR0FBMkI7QUFBeEMsS0FDRSxFQUFDLEtBQUQsUUFDRSxFQUFDLElBQUQ7QUFBTSxJQUFBLFNBQVMsRUFBQztBQUFoQixLQUNFLEVBQUMsS0FBRDtBQUNFLElBQUEsS0FBSyxFQUFFTyxLQURUO0FBRUUsSUFBQSxXQUFXLEVBQUMsT0FGZDtBQUdFLElBQUEsSUFBSSxFQUFDLE9BSFA7QUFJRSxJQUFBLFFBQVEsRUFBRUcsWUFKWjtBQUtFLElBQUEsSUFBSSxFQUFDLE9BTFA7QUFNRSxJQUFBLEVBQUUsRUFBQyxPQU5MO0FBT0UsSUFBQSxlQUFlLEVBQUUsQ0FDZlEsZUFBZSxDQUFDQyx1QkFERCxFQUVmRCxlQUFlLENBQUNFLG9CQUZEO0FBUG5CLElBREYsRUFhRSxFQUFDLE1BQUQ7QUFDRSxJQUFBLFNBQVMsRUFBQyxLQURaO0FBRUUsSUFBQSxJQUFJLEVBQUMsUUFGUDtBQUdFLElBQUEsT0FBTyxFQUFFWixvQkFIWDtBQUlFLElBQUEsRUFBRSxFQUFDLHVCQUpMO0FBS0UsSUFBQSxLQUFLLEVBQUM7QUFMUixJQWJGLENBREYsQ0FERixDQURGO0FBMkJEOzs7OyJ9
