import {
  b as useAuthContext,
  c as useFormContext,
  k as useUserName,
  u as useRouteContext,
  a as useMediaQuery,
  p,
  m as getTokenFromUrl,
  h,
  v as validationTypes,
  d as valueChanged,
  n as changePassword,
} from "./index-a45f22ef.js";
import {
  P as Paper,
  F as Form,
  I as Input,
  B as Button,
  G as Grid,
} from "./Grid-5c4f045b.js";
import "./style-0252033b.js";

function ChangePassword() {
  const { state, dispatch } = useAuthContext();
  const { dispatch: formDispatch } = useFormContext();
  const { token } = useUserName();
  const [route, setRoute] = useRouteContext();
  const { device } = useMediaQuery();
  const { password, confirm, error } = state;
  p(() => {
    let url = new URL(window.location.href);
    var urltoken = url.searchParams.get("token");

    if (urltoken) {
      dispatch(
        getTokenFromUrl({
          token: urltoken,
        })
      );
    }
  }, []);
  p(() => {
    if (state.authFeedback) {
      setRoute("/authfeedback");
    }
  }, [state.authFeedback]);

  function handleChange(e) {
    const { name, value } = e.target;
    dispatch(
      valueChanged({
        propName: name,
        value,
        dispatch,
        state,
      })
    );
  }

  function handleChangePass() {
    dispatch(
      changePassword({
        dispatch,
        state,
        token,
        formDispatch,
      })
    );
  }

  return h(
    Grid,
    {
      width: device === "phone" ? 100 : 25,
    },
    h(
      Paper,
      null,
      h(
        Form,
        {
          formTitle: "Change Password",
          error: error,
        },
        h(Input, {
          value: password,
          type: "password",
          id: "password",
          name: "password",
          placeholder: "Enter new password",
          onChange: handleChange,
          validationTypes: [validationTypes.PASSWORD_FORMAT_VALIDATION],
        }),
        h(Input, {
          value: confirm,
          type: "password",
          id: "confirm",
          name: "confirm",
          placeholder: "Confirm new password",
          onChange: handleChange,
          validationTypes: [validationTypes.PASSWORDS_MATCH_VALIDATION],
        }),
        h(Button, {
          type: "button",
          id: "change-pass-btn",
          "data-testid": "change-pass-btn",
          onClick: handleChangePass,
          title: "Change",
        })
      )
    )
  );
}

export default ChangePassword;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hhbmdlUGFzc3dvcmQtNTA3MjcyMTEuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9hdXRoL0NoYW5nZVBhc3N3b3JkLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCAnLi9jc3Mvc3R5bGUuY3NzJztcbmltcG9ydCBJbnB1dCBmcm9tICcuLi9mb3JtL0lucHV0JztcbmltcG9ydCBGb3JtIGZyb20gJy4uL2Zvcm0vRm9ybSc7XG5pbXBvcnQgQnV0dG9uIGZyb20gJy4uL2Zvcm0vQnV0dG9uJztcbmltcG9ydCB2YWxpZGF0aW9uVHlwZXMgZnJvbSAnLi4vZm9ybS92YWxpZGF0aW9uVHlwZXMnO1xuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuL2F1dGgtY29udGV4dCc7XG5pbXBvcnQgeyB1c2VGb3JtQ29udGV4dCB9IGZyb20gJy4uL2Zvcm0vZm9ybS1jb250ZXh0JztcbmltcG9ydCAqIGFzIGFjdGlvbnMgZnJvbSAnLi9hY3Rpb25zJztcbmltcG9ydCB7IHVzZU1lZGlhUXVlcnkgfSBmcm9tICcuLi9sYXlvdXQvdXNlTWVkaWFRdWVyeSc7XG5pbXBvcnQgeyBQYXBlciB9IGZyb20gJy4uL2xheW91dC9QYXBlcic7XG5pbXBvcnQgeyBHcmlkIH0gZnJvbSAnLi4vbGF5b3V0L0dyaWQnO1xuaW1wb3J0IHsgdXNlUm91dGVDb250ZXh0IH0gZnJvbSAnLi4vcm91dGUvcm91dGVyJztcbmltcG9ydCB7IHVzZVVzZXJOYW1lIH0gZnJvbSAnLi91c2VVc2VyTmFtZSc7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDaGFuZ2VQYXNzd29yZCgpIHtcbiAgY29uc3QgeyBzdGF0ZSwgZGlzcGF0Y2ggfSA9IHVzZUF1dGhDb250ZXh0KCk7XG4gIGNvbnN0IHsgZGlzcGF0Y2g6IGZvcm1EaXNwYXRjaCB9ID0gdXNlRm9ybUNvbnRleHQoKTtcbiAgY29uc3QgeyB0b2tlbiB9ID0gdXNlVXNlck5hbWUoKTtcbiAgY29uc3QgW3JvdXRlLCBzZXRSb3V0ZV0gPSB1c2VSb3V0ZUNvbnRleHQoKTtcbiAgY29uc3QgeyBkZXZpY2UgfSA9IHVzZU1lZGlhUXVlcnkoKTtcblxuICBjb25zdCB7IHBhc3N3b3JkLCBjb25maXJtLCBlcnJvciB9ID0gc3RhdGU7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBsZXQgdXJsID0gbmV3IFVSTCh3aW5kb3cubG9jYXRpb24uaHJlZik7XG4gICAgdmFyIHVybHRva2VuID0gdXJsLnNlYXJjaFBhcmFtcy5nZXQoJ3Rva2VuJyk7XG5cbiAgICBpZiAodXJsdG9rZW4pIHtcbiAgICAgIGRpc3BhdGNoKGFjdGlvbnMuZ2V0VG9rZW5Gcm9tVXJsKHsgdG9rZW46IHVybHRva2VuIH0pKTtcbiAgICB9XG4gIH0sIFtdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChzdGF0ZS5hdXRoRmVlZGJhY2spIHtcbiAgICAgIHNldFJvdXRlKCcvYXV0aGZlZWRiYWNrJyk7XG4gICAgfVxuICB9LCBbc3RhdGUuYXV0aEZlZWRiYWNrXSk7XG5cbiAgZnVuY3Rpb24gaGFuZGxlQ2hhbmdlKGUpIHtcbiAgICBjb25zdCB7IG5hbWUsIHZhbHVlIH0gPSBlLnRhcmdldDtcbiAgICBkaXNwYXRjaChcbiAgICAgIGFjdGlvbnMudmFsdWVDaGFuZ2VkKHtcbiAgICAgICAgcHJvcE5hbWU6IG5hbWUsXG4gICAgICAgIHZhbHVlLFxuICAgICAgICBkaXNwYXRjaCxcbiAgICAgICAgc3RhdGUsXG4gICAgICB9KVxuICAgICk7XG4gIH1cbiAgZnVuY3Rpb24gaGFuZGxlQ2hhbmdlUGFzcygpIHtcbiAgICBkaXNwYXRjaChcbiAgICAgIGFjdGlvbnMuY2hhbmdlUGFzc3dvcmQoe1xuICAgICAgICBkaXNwYXRjaCxcbiAgICAgICAgc3RhdGUsXG4gICAgICAgIHRva2VuLFxuICAgICAgICBmb3JtRGlzcGF0Y2gsXG4gICAgICB9KVxuICAgICk7XG4gIH1cbiAgcmV0dXJuIChcbiAgICA8R3JpZCB3aWR0aD17ZGV2aWNlID09PSAncGhvbmUnID8gMTAwIDogMjV9PlxuICAgICAgPFBhcGVyPlxuICAgICAgICA8Rm9ybSBmb3JtVGl0bGU9J0NoYW5nZSBQYXNzd29yZCcgZXJyb3I9e2Vycm9yfT5cbiAgICAgICAgICA8SW5wdXRcbiAgICAgICAgICAgIHZhbHVlPXtwYXNzd29yZH1cbiAgICAgICAgICAgIHR5cGU9J3Bhc3N3b3JkJ1xuICAgICAgICAgICAgaWQ9J3Bhc3N3b3JkJ1xuICAgICAgICAgICAgbmFtZT0ncGFzc3dvcmQnXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj0nRW50ZXIgbmV3IHBhc3N3b3JkJ1xuICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cbiAgICAgICAgICAgIHZhbGlkYXRpb25UeXBlcz17W3ZhbGlkYXRpb25UeXBlcy5QQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTl19XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8SW5wdXRcbiAgICAgICAgICAgIHZhbHVlPXtjb25maXJtfVxuICAgICAgICAgICAgdHlwZT0ncGFzc3dvcmQnXG4gICAgICAgICAgICBpZD0nY29uZmlybSdcbiAgICAgICAgICAgIG5hbWU9J2NvbmZpcm0nXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj0nQ29uZmlybSBuZXcgcGFzc3dvcmQnXG4gICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfVxuICAgICAgICAgICAgdmFsaWRhdGlvblR5cGVzPXtbdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OXX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIHR5cGU9J2J1dHRvbidcbiAgICAgICAgICAgIGlkPSdjaGFuZ2UtcGFzcy1idG4nXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD0nY2hhbmdlLXBhc3MtYnRuJ1xuICAgICAgICAgICAgb25DbGljaz17aGFuZGxlQ2hhbmdlUGFzc31cbiAgICAgICAgICAgIHRpdGxlPSdDaGFuZ2UnXG4gICAgICAgICAgLz5cbiAgICAgICAgPC9Gb3JtPlxuICAgICAgPC9QYXBlcj5cbiAgICA8L0dyaWQ+XG4gICk7XG59XG4iXSwibmFtZXMiOlsiQ2hhbmdlUGFzc3dvcmQiLCJzdGF0ZSIsImRpc3BhdGNoIiwidXNlQXV0aENvbnRleHQiLCJmb3JtRGlzcGF0Y2giLCJ1c2VGb3JtQ29udGV4dCIsInRva2VuIiwidXNlVXNlck5hbWUiLCJyb3V0ZSIsInNldFJvdXRlIiwidXNlUm91dGVDb250ZXh0IiwiZGV2aWNlIiwidXNlTWVkaWFRdWVyeSIsInBhc3N3b3JkIiwiY29uZmlybSIsImVycm9yIiwidXNlRWZmZWN0IiwidXJsIiwiVVJMIiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwidXJsdG9rZW4iLCJzZWFyY2hQYXJhbXMiLCJnZXQiLCJhY3Rpb25zIiwiYXV0aEZlZWRiYWNrIiwiaGFuZGxlQ2hhbmdlIiwiZSIsIm5hbWUiLCJ2YWx1ZSIsInRhcmdldCIsInByb3BOYW1lIiwiaGFuZGxlQ2hhbmdlUGFzcyIsInZhbGlkYXRpb25UeXBlcyIsIlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OIiwiUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT04iXSwibWFwcGluZ3MiOiI7Ozs7QUFlZSxTQUFTQSxjQUFULEdBQTBCO0FBQ3ZDLFFBQU07QUFBRUMsSUFBQUEsS0FBRjtBQUFTQyxJQUFBQTtBQUFULE1BQXNCQyxjQUFjLEVBQTFDO0FBQ0EsUUFBTTtBQUFFRCxJQUFBQSxRQUFRLEVBQUVFO0FBQVosTUFBNkJDLGNBQWMsRUFBakQ7QUFDQSxRQUFNO0FBQUVDLElBQUFBO0FBQUYsTUFBWUMsV0FBVyxFQUE3QjtBQUNBLFFBQU0sQ0FBQ0MsS0FBRCxFQUFRQyxRQUFSLElBQW9CQyxlQUFlLEVBQXpDO0FBQ0EsUUFBTTtBQUFFQyxJQUFBQTtBQUFGLE1BQWFDLGFBQWEsRUFBaEM7QUFF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
