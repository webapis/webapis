import { a as h } from './index-bdb5940f.js';
import { B as Button } from './Button-508f2902.js';
import { L as Layout } from './Layout-26b487fb.js';
import { M as Message } from './Message-8e662a10.js';

const style = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%'
  }
};
function Inviter({
  hangout,
  onAccept,
  onDecline
}) {
  return h(Layout, {
    id: "inviter-ui"
  }, h("div", {
    style: style.root
  }, h("div", {
    style: {
      flex: 1,
      marginTop: 16,
      marginLeft: 8
    }
  }, h(Message, {
    message: hangout && hangout.message,
    username: hangout && hangout.username
  })), h("div", {
    style: {
      display: 'flex',
      padding: 8
    }
  }, h(Button, {
    onClick: onDecline,
    title: "Ignore",
    style: {
      flex: 1,
      marginRight: 4,
      color: 'red'
    }
  }), h(Button, {
    onClick: onAccept,
    "data-testid": "accept-btn",
    title: "Accept",
    style: {
      flex: 1,
      marginLeft: 4,
      color: 'green'
    }
  }))));
}

export default Inviter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW52aXRlci1jOGY1MDRiZi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlLXVpL0ludml0ZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi8uLi9sYXlvdXQvQnV0dG9uJztcbmltcG9ydCB7IE1lc3NhZ2UgfSBmcm9tICcuLi91aS9NZXNzYWdlJztcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4uL3N0YXRlLXVpL0xheW91dCc7XG5jb25zdCBzdHlsZSA9IHtcbiAgcm9vdDoge1xuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcbiAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgIGhlaWdodDogJzEwMCUnLFxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSW52aXRlcih7IGhhbmdvdXQsIG9uQWNjZXB0LG9uRGVjbGluZSB9KSB7XG4gIHJldHVybiAoXG4gICAgPExheW91dCBpZD0naW52aXRlci11aSc+XG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5yb290fT5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBmbGV4OiAxLCBtYXJnaW5Ub3A6IDE2LCBtYXJnaW5MZWZ0OiA4IH19PlxuICAgICAgICAgIDxNZXNzYWdlXG4gICAgICAgICAgICBtZXNzYWdlPXtoYW5nb3V0ICYmIGhhbmdvdXQubWVzc2FnZX1cbiAgICAgICAgICAgIHVzZXJuYW1lPXtoYW5nb3V0ICYmIGhhbmdvdXQudXNlcm5hbWV9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIHBhZGRpbmc6IDggfX0+XG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgIG9uQ2xpY2s9e29uRGVjbGluZX1cbiAgICAgICAgICAgIHRpdGxlPVwiSWdub3JlXCJcbiAgICAgICAgICAgIHN0eWxlPXt7IGZsZXg6IDEsIG1hcmdpblJpZ2h0OiA0LCBjb2xvcjogJ3JlZCcgfX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICBvbkNsaWNrPXtvbkFjY2VwdH1cbiAgICAgICAgICBkYXRhLXRlc3RpZD0nYWNjZXB0LWJ0bidcbiAgICAgICAgICAgIHRpdGxlPVwiQWNjZXB0XCJcbiAgICAgICAgICAgIHN0eWxlPXt7IGZsZXg6IDEsIG1hcmdpbkxlZnQ6IDQsIGNvbG9yOiAnZ3JlZW4nIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L0xheW91dD5cbiAgKTtcbn1cbiJdLCJuYW1lcyI6WyJzdHlsZSIsInJvb3QiLCJkaXNwbGF5IiwiZmxleERpcmVjdGlvbiIsImp1c3RpZnlDb250ZW50IiwiaGVpZ2h0IiwiSW52aXRlciIsImhhbmdvdXQiLCJvbkFjY2VwdCIsIm9uRGVjbGluZSIsImZsZXgiLCJtYXJnaW5Ub3AiLCJtYXJnaW5MZWZ0IiwibWVzc2FnZSIsInVzZXJuYW1lIiwicGFkZGluZyIsIm1hcmdpblJpZ2h0IiwiY29sb3IiXSwibWFwcGluZ3MiOiI7Ozs7O0FBSUEsTUFBTUEsS0FBSyxHQUFHO0FBQ1pDLEVBQUFBLElBQUksRUFBRTtBQUNKQyxJQUFBQSxPQUFPLEVBQUUsTUFETDtBQUVKQyxJQUFBQSxhQUFhLEVBQUUsUUFGWDtBQUdKQyxJQUFBQSxjQUFjLEVBQUUsZUFIWjtBQUlKQyxJQUFBQSxNQUFNLEVBQUU7QUFKSjtBQURNLENBQWQ7QUFTZSxTQUFTQyxPQUFULENBQWlCO0FBQUVDLEVBQUFBLE9BQUY7QUFBV0MsRUFBQUEsUUFBWDtBQUFvQkMsRUFBQUE7QUFBcEIsQ0FBakIsRUFBa0Q7QUFDL0QsU0FDRSxFQUFDLE1BQUQ7QUFBUSxJQUFBLEVBQUUsRUFBQztBQUFYLEtBQ0U7QUFBSyxJQUFBLEtBQUssRUFBRVQsS0FBSyxDQUFDQztBQUFsQixLQUNFO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBRVMsTUFBQUEsSUFBSSxFQUFFLENBQVI7QUFBV0MsTUFBQUEsU0FBUyxFQUFFLEVBQXRCO0FBQTBCQyxNQUFBQSxVQUFVLEVBQUU7QUFBdEM7QUFBWixLQUNFLEVBQUMsT0FBRDtBQUNFLElBQUEsT0FBTyxFQUFFTCxPQUFPLElBQUlBLE9BQU8sQ0FBQ00sT0FEOUI7QUFFRSxJQUFBLFFBQVEsRUFBRU4sT0FBTyxJQUFJQSxPQUFPLENBQUNPO0FBRi9CLElBREYsQ0FERixFQVFFO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBRVosTUFBQUEsT0FBTyxFQUFFLE1BQVg7QUFBbUJhLE1BQUFBLE9BQU8sRUFBRTtBQUE1QjtBQUFaLEtBQ0UsRUFBQyxNQUFEO0FBQ0EsSUFBQSxPQUFPLEVBQUVOLFNBRFQ7QUFFRSxJQUFBLEtBQUssRUFBQyxRQUZSO0FBR0UsSUFBQSxLQUFLLEVBQUU7QUFBRUMsTUFBQUEsSUFBSSxFQUFFLENBQVI7QUFBV00sTUFBQUEsV0FBVyxFQUFFLENBQXhCO0FBQTJCQyxNQUFBQSxLQUFLLEVBQUU7QUFBbEM7QUFIVCxJQURGLEVBTUUsRUFBQyxNQUFEO0FBQ0EsSUFBQSxPQUFPLEVBQUVULFFBRFQ7QUFFQSxtQkFBWSxZQUZaO0FBR0UsSUFBQSxLQUFLLEVBQUMsUUFIUjtBQUlFLElBQUEsS0FBSyxFQUFFO0FBQUVFLE1BQUFBLElBQUksRUFBRSxDQUFSO0FBQVdFLE1BQUFBLFVBQVUsRUFBRSxDQUF2QjtBQUEwQkssTUFBQUEsS0FBSyxFQUFFO0FBQWpDO0FBSlQsSUFORixDQVJGLENBREYsQ0FERjtBQTBCRDs7OzsifQ==
