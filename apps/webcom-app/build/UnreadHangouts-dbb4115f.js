import { m, l, h, L as List, w as ListItem } from './index-e3b74eca.js';

function reducerUnreadhangouts({
  unreadhangouts
}) {
  return unreadhangouts.reduce((accumulator, current, index) => {
    if (index === 0) {
      return accumulator = [{ ...current,
        messageCount: 1
      }];
    } else {
      const obj = accumulator.find(a => a.username === current.username && current.state === 'MESSANGER');

      if (obj) {
        const index = accumulator.findIndex(a => a.username === current.username); //if current exist inside accumilator map it to that object

        accumulator.splice(index, 1, { ...obj,
          messageCount: ++obj.messageCount
        });
      } else {
        //if current exist inside accumilator map it to that object
        accumulator.push({ ...current,
          messageCount: 1
        });
      }
    }

    return accumulator;
  }, []);
}

function UnreadHangouts({
  unreadhangouts
}) {
  const [items, setItems] = m([]);
  l(() => {
    if (unreadhangouts) {
      const reduced = reducerUnreadhangouts({
        unreadhangouts
      });
      setItems(reduced);
    }
  }, [unreadhangouts]);
  return h("div", {
    "data-testid": "unreadhangouts"
  }, h(List, null, items && items.length > 0 && items.map(u => {
    debugger;
    return h(ListItem, {
      id: u.username
    }, u.username, " ", h("div", {
      style: {
        color: '#737373'
      }
    }, "messages: ", u.messageCount));
  })));
}

export default UnreadHangouts;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVW5yZWFkSGFuZ291dHMtZGJiNDExNWYuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VVbnJlYWRoYW5nb3V0cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9VbnJlYWRIYW5nb3V0cy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gcmVkdWNlclVucmVhZGhhbmdvdXRzKHt1bnJlYWRoYW5nb3V0c30pe1xuICAgIHJldHVybiAgIHVucmVhZGhhbmdvdXRzLnJlZHVjZSgoYWNjdW11bGF0b3IsIGN1cnJlbnQsIGluZGV4KSA9PiB7XG4gICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiAoYWNjdW11bGF0b3IgPSBbeyAuLi5jdXJyZW50LCBtZXNzYWdlQ291bnQ6IDEgfV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IG9iaiA9IGFjY3VtdWxhdG9yLmZpbmQoXG4gICAgICAgICAgICAoYSkgPT4gYS51c2VybmFtZSA9PT0gY3VycmVudC51c2VybmFtZSAmJiBjdXJyZW50LnN0YXRlID09PSAnTUVTU0FOR0VSJ1xuICAgICAgICAgICk7XG4gICAgICAgICAgaWYgKG9iaikge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBhY2N1bXVsYXRvci5maW5kSW5kZXgoXG4gICAgICAgICAgICAgIChhKSA9PiBhLnVzZXJuYW1lID09PSBjdXJyZW50LnVzZXJuYW1lXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgLy9pZiBjdXJyZW50IGV4aXN0IGluc2lkZSBhY2N1bWlsYXRvciBtYXAgaXQgdG8gdGhhdCBvYmplY3RcbiAgICAgICAgICAgIGFjY3VtdWxhdG9yLnNwbGljZShpbmRleCwgMSwge1xuICAgICAgICAgICAgICAuLi5vYmosXG4gICAgICAgICAgICAgIG1lc3NhZ2VDb3VudDogKytvYmoubWVzc2FnZUNvdW50LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vaWYgY3VycmVudCBleGlzdCBpbnNpZGUgYWNjdW1pbGF0b3IgbWFwIGl0IHRvIHRoYXQgb2JqZWN0XG4gICAgICAgICAgICBhY2N1bXVsYXRvci5wdXNoKHsgLi4uY3VycmVudCwgbWVzc2FnZUNvdW50OiAxIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWNjdW11bGF0b3I7XG4gICAgICB9LCBbXSk7XG59IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IExpc3QsIExpc3RJdGVtIH0gZnJvbSAnLi4vbGF5b3V0L05hdkxpc3QnO1xuaW1wb3J0IHtyZWR1Y2VyVW5yZWFkaGFuZ291dHN9IGZyb20gJy4uL2hhbmdvdXRzL3N0YXRlL3JlZHVjZVVucmVhZGhhbmdvdXRzJ1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVW5yZWFkSGFuZ291dHMoeyB1bnJlYWRoYW5nb3V0cyB9KSB7XG4gIGNvbnN0IFtpdGVtcyxzZXRJdGVtc10gPXVzZVN0YXRlKFtdKVxudXNlRWZmZWN0KCgpPT57XG5pZih1bnJlYWRoYW5nb3V0cyl7XG4gIGNvbnN0IHJlZHVjZWQgPXJlZHVjZXJVbnJlYWRoYW5nb3V0cyh7dW5yZWFkaGFuZ291dHN9KVxuICBzZXRJdGVtcyhyZWR1Y2VkKVxufVxuXG59LFt1bnJlYWRoYW5nb3V0c10pXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPSd1bnJlYWRoYW5nb3V0cyc+XG4gICAgICA8TGlzdD5cbiAgICAgICAge2l0ZW1zICYmXG4gICAgICAgICAgaXRlbXMubGVuZ3RoID4gMCAmJlxuICAgICAgICAgIGl0ZW1zLm1hcCgodSkgPT4ge1xuICAgICAgICAgICAgZGVidWdnZXI7XG4gICAgICAgICAgcmV0dXJuIDxMaXN0SXRlbSBpZD17dS51c2VybmFtZX0+e3UudXNlcm5hbWV9IDxkaXYgc3R5bGU9e3tjb2xvcjonIzczNzM3Myd9fT5tZXNzYWdlczoge3UubWVzc2FnZUNvdW50fTwvZGl2PjwvTGlzdEl0ZW0+O1xuICAgICAgICAgIH0pfVxuICAgICAgPC9MaXN0PlxuICAgIDwvZGl2PlxuICApO1xufVxuIl0sIm5hbWVzIjpbInJlZHVjZXJVbnJlYWRoYW5nb3V0cyIsInVucmVhZGhhbmdvdXRzIiwicmVkdWNlIiwiYWNjdW11bGF0b3IiLCJjdXJyZW50IiwiaW5kZXgiLCJtZXNzYWdlQ291bnQiLCJvYmoiLCJmaW5kIiwiYSIsInVzZXJuYW1lIiwic3RhdGUiLCJmaW5kSW5kZXgiLCJzcGxpY2UiLCJwdXNoIiwiVW5yZWFkSGFuZ291dHMiLCJpdGVtcyIsInNldEl0ZW1zIiwidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJyZWR1Y2VkIiwibGVuZ3RoIiwibWFwIiwidSIsImNvbG9yIl0sIm1hcHBpbmdzIjoiOztBQUFPLFNBQVNBLHFCQUFULENBQStCO0FBQUNDLEVBQUFBO0FBQUQsQ0FBL0IsRUFBZ0Q7QUFDbkQsU0FBU0EsY0FBYyxDQUFDQyxNQUFmLENBQXNCLENBQUNDLFdBQUQsRUFBY0MsT0FBZCxFQUF1QkMsS0FBdkIsS0FBaUM7QUFDNUQsUUFBSUEsS0FBSyxLQUFLLENBQWQsRUFBaUI7QUFDZixhQUFRRixXQUFXLEdBQUcsQ0FBQyxFQUFFLEdBQUdDLE9BQUw7QUFBY0UsUUFBQUEsWUFBWSxFQUFFO0FBQTVCLE9BQUQsQ0FBdEI7QUFDRCxLQUZELE1BRU87QUFDTCxZQUFNQyxHQUFHLEdBQUdKLFdBQVcsQ0FBQ0ssSUFBWixDQUNUQyxDQUFELElBQU9BLENBQUMsQ0FBQ0MsUUFBRixLQUFlTixPQUFPLENBQUNNLFFBQXZCLElBQW1DTixPQUFPLENBQUNPLEtBQVIsS0FBa0IsV0FEbEQsQ0FBWjs7QUFHQSxVQUFJSixHQUFKLEVBQVM7QUFDUCxjQUFNRixLQUFLLEdBQUdGLFdBQVcsQ0FBQ1MsU0FBWixDQUNYSCxDQUFELElBQU9BLENBQUMsQ0FBQ0MsUUFBRixLQUFlTixPQUFPLENBQUNNLFFBRGxCLENBQWQsQ0FETzs7QUFLUFAsUUFBQUEsV0FBVyxDQUFDVSxNQUFaLENBQW1CUixLQUFuQixFQUEwQixDQUExQixFQUE2QixFQUMzQixHQUFHRSxHQUR3QjtBQUUzQkQsVUFBQUEsWUFBWSxFQUFFLEVBQUVDLEdBQUcsQ0FBQ0Q7QUFGTyxTQUE3QjtBQUlELE9BVEQsTUFTTztBQUNMO0FBQ0FILFFBQUFBLFdBQVcsQ0FBQ1csSUFBWixDQUFpQixFQUFFLEdBQUdWLE9BQUw7QUFBY0UsVUFBQUEsWUFBWSxFQUFFO0FBQTVCLFNBQWpCO0FBQ0Q7QUFDRjs7QUFDRCxXQUFPSCxXQUFQO0FBQ0QsR0F0Qk0sRUFzQkosRUF0QkksQ0FBVDtBQXVCSDs7QUNwQmMsU0FBU1ksY0FBVCxDQUF3QjtBQUFFZCxFQUFBQTtBQUFGLENBQXhCLEVBQTRDO0FBQ3pELFFBQU0sQ0FBQ2UsS0FBRCxFQUFPQyxRQUFQLElBQWtCQyxDQUFRLENBQUMsRUFBRCxDQUFoQztBQUNGQyxFQUFBQSxDQUFTLENBQUMsTUFBSTtBQUNkLFFBQUdsQixjQUFILEVBQWtCO0FBQ2hCLFlBQU1tQixPQUFPLEdBQUVwQixxQkFBcUIsQ0FBQztBQUFDQyxRQUFBQTtBQUFELE9BQUQsQ0FBcEM7QUFDQWdCLE1BQUFBLFFBQVEsQ0FBQ0csT0FBRCxDQUFSO0FBQ0Q7QUFFQSxHQU5RLEVBTVAsQ0FBQ25CLGNBQUQsQ0FOTyxDQUFUO0FBUUUsU0FDRTtBQUFLLG1CQUFZO0FBQWpCLEtBQ0UsRUFBQyxJQUFELFFBQ0dlLEtBQUssSUFDSkEsS0FBSyxDQUFDSyxNQUFOLEdBQWUsQ0FEaEIsSUFFQ0wsS0FBSyxDQUFDTSxHQUFOLENBQVdDLENBQUQsSUFBTztBQUNmO0FBQ0YsV0FBTyxFQUFDLFFBQUQ7QUFBVSxNQUFBLEVBQUUsRUFBRUEsQ0FBQyxDQUFDYjtBQUFoQixPQUEyQmEsQ0FBQyxDQUFDYixRQUE3QixPQUF1QztBQUFLLE1BQUEsS0FBSyxFQUFFO0FBQUNjLFFBQUFBLEtBQUssRUFBQztBQUFQO0FBQVoscUJBQTBDRCxDQUFDLENBQUNqQixZQUE1QyxDQUF2QyxDQUFQO0FBQ0MsR0FIRCxDQUhKLENBREYsQ0FERjtBQVlEOzs7OyJ9
