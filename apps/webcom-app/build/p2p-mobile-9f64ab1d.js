import { e as useRouteContext, c as useMediaQuery, p, h } from './index-39e7257b.js';

function PeerToPeerMobile() {
  const [route, setRoute] = useRouteContext();
  const {
    width
  } = useMediaQuery();
  p(() => {
    if (width < 800) {
      setRoute('/contacts');
    }
  }, []);
  return h("div", null, "PeerToPeerMobile");
}

export default PeerToPeerMobile;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicDJwLW1vYmlsZS05ZjY0YWIxZC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY2xpZW50L3AycC9wMnAtbW9iaWxlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyB1c2VSb3V0ZUNvbnRleHQgfSBmcm9tICcuLi9yb3V0ZS9yb3V0ZXInO1xyXG5pbXBvcnQgeyB1c2VNZWRpYVF1ZXJ5IH0gZnJvbSAnLi4vbGF5b3V0L3VzZU1lZGlhUXVlcnknO1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBQZWVyVG9QZWVyTW9iaWxlKCkge1xyXG4gIGNvbnN0IFtyb3V0ZSwgc2V0Um91dGVdID0gdXNlUm91dGVDb250ZXh0KCk7XHJcbiAgY29uc3QgeyB3aWR0aCB9ID0gdXNlTWVkaWFRdWVyeSgpO1xyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAod2lkdGggPCA4MDApIHtcclxuICAgICAgc2V0Um91dGUoJy9jb250YWN0cycpO1xyXG4gICAgfVxyXG4gIH0sIFtdKTtcclxuXHJcbiAgcmV0dXJuIDxkaXY+UGVlclRvUGVlck1vYmlsZTwvZGl2PjtcclxufVxyXG4iXSwibmFtZXMiOlsiUGVlclRvUGVlck1vYmlsZSIsInJvdXRlIiwic2V0Um91dGUiLCJ1c2VSb3V0ZUNvbnRleHQiLCJ3aWR0aCIsInVzZU1lZGlhUXVlcnkiLCJ1c2VFZmZlY3QiXSwibWFwcGluZ3MiOiI7O0FBSWUsU0FBU0EsZ0JBQVQsR0FBNEI7QUFDekMsUUFBTSxDQUFDQyxLQUFELEVBQVFDLFFBQVIsSUFBb0JDLGVBQWUsRUFBekM7QUFDQSxRQUFNO0FBQUVDLElBQUFBO0FBQUYsTUFBWUMsYUFBYSxFQUEvQjtBQUNBQyxFQUFBQSxDQUFTLENBQUMsTUFBTTtBQUNkLFFBQUlGLEtBQUssR0FBRyxHQUFaLEVBQWlCO0FBQ2ZGLE1BQUFBLFFBQVEsQ0FBQyxXQUFELENBQVI7QUFDRDtBQUNGLEdBSlEsRUFJTixFQUpNLENBQVQ7QUFNQSxTQUFPLGtDQUFQO0FBQ0Q7Ozs7In0=
