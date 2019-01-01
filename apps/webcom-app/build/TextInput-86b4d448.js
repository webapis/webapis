import { h, _ as _extends } from './index-263a7d0c.js';

const styles = {
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
    type = 'text',
    style
  } = props;
  return h("div", {
    style: {
      display: 'flex',
      width: '100%'
    }
  }, h("input", _extends({
    style: { ...styles,
      ...style
    }
  }, props, {
    "data-testid": id,
    type: type
  })));
}

export { TextInput as T };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGV4dElucHV0LTg2YjRkNDQ4LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9jbGllbnQvY29tcG9uZW50cy9UZXh0SW5wdXQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5jb25zdCBzdHlsZXMgPSB7XHJcbiAgcGFkZGluZzogOCxcclxuICBtYXJnaW5MZWZ0OiAxNixcclxuICBtYXJnaW5SaWdodDogMTYsXHJcbiAgbWFyZ2luVG9wOiA4LFxyXG4gIG1hcmdpbkJvdHRvbTogOCxcclxuICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcclxuICBmbGV4OiAxLFxyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFRleHRJbnB1dChwcm9wcykge1xyXG4gIGNvbnN0IHsgaWQsIHR5cGUgPSAndGV4dCcsc3R5bGUgfSA9IHByb3BzO1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4Jywgd2lkdGg6ICcxMDAlJyB9fT5cclxuICAgICAgPGlucHV0ICBzdHlsZT17ey4uLnN0eWxlcywuLi5zdHlsZX19IHsuLi5wcm9wc30gZGF0YS10ZXN0aWQ9e2lkfSB0eXBlPXt0eXBlfSAvPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iXSwibmFtZXMiOlsic3R5bGVzIiwicGFkZGluZyIsIm1hcmdpbkxlZnQiLCJtYXJnaW5SaWdodCIsIm1hcmdpblRvcCIsIm1hcmdpbkJvdHRvbSIsImJveFNpemluZyIsImZsZXgiLCJUZXh0SW5wdXQiLCJwcm9wcyIsImlkIiwidHlwZSIsInN0eWxlIiwiZGlzcGxheSIsIndpZHRoIl0sIm1hcHBpbmdzIjoiOztBQUVBLE1BQU1BLE1BQU0sR0FBRztBQUNiQyxFQUFBQSxPQUFPLEVBQUUsQ0FESTtBQUViQyxFQUFBQSxVQUFVLEVBQUUsRUFGQztBQUdiQyxFQUFBQSxXQUFXLEVBQUUsRUFIQTtBQUliQyxFQUFBQSxTQUFTLEVBQUUsQ0FKRTtBQUtiQyxFQUFBQSxZQUFZLEVBQUUsQ0FMRDtBQU1iQyxFQUFBQSxTQUFTLEVBQUUsWUFORTtBQU9iQyxFQUFBQSxJQUFJLEVBQUU7QUFQTyxDQUFmO0FBVU8sU0FBU0MsU0FBVCxDQUFtQkMsS0FBbkIsRUFBMEI7QUFDL0IsUUFBTTtBQUFFQyxJQUFBQSxFQUFGO0FBQU1DLElBQUFBLElBQUksR0FBRyxNQUFiO0FBQW9CQyxJQUFBQTtBQUFwQixNQUE4QkgsS0FBcEM7QUFDQSxTQUNFO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBRUksTUFBQUEsT0FBTyxFQUFFLE1BQVg7QUFBbUJDLE1BQUFBLEtBQUssRUFBRTtBQUExQjtBQUFaLEtBQ0U7QUFBUSxJQUFBLEtBQUssRUFBRSxFQUFDLEdBQUdkLE1BQUo7QUFBVyxTQUFHWTtBQUFkO0FBQWYsS0FBeUNILEtBQXpDO0FBQWdELG1CQUFhQyxFQUE3RDtBQUFpRSxJQUFBLElBQUksRUFBRUM7QUFBdkUsS0FERixDQURGO0FBS0Q7Ozs7In0=
