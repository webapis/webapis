import { m, l, h, L as List, w as ListItem } from './index-c0ddbc60.js';

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
  unreadhangouts,
  onSelectUnread
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
      onClick: onSelectUnread,
      id: u.username
    }, u.username, " ", h("div", {
      style: {
        color: '#737373'
      }
    }, "messages: ", u.messageCount));
  })));
}

export default UnreadHangouts;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVW5yZWFkSGFuZ291dHMtYzcxNTBiZDguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VVbnJlYWRoYW5nb3V0cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9VbnJlYWRIYW5nb3V0cy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gcmVkdWNlclVucmVhZGhhbmdvdXRzKHt1bnJlYWRoYW5nb3V0c30pe1xuICAgIHJldHVybiAgIHVucmVhZGhhbmdvdXRzLnJlZHVjZSgoYWNjdW11bGF0b3IsIGN1cnJlbnQsIGluZGV4KSA9PiB7XG4gICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiAoYWNjdW11bGF0b3IgPSBbeyAuLi5jdXJyZW50LCBtZXNzYWdlQ291bnQ6IDEgfV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IG9iaiA9IGFjY3VtdWxhdG9yLmZpbmQoXG4gICAgICAgICAgICAoYSkgPT4gYS51c2VybmFtZSA9PT0gY3VycmVudC51c2VybmFtZSAmJiBjdXJyZW50LnN0YXRlID09PSAnTUVTU0FOR0VSJ1xuICAgICAgICAgICk7XG4gICAgICAgICAgaWYgKG9iaikge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBhY2N1bXVsYXRvci5maW5kSW5kZXgoXG4gICAgICAgICAgICAgIChhKSA9PiBhLnVzZXJuYW1lID09PSBjdXJyZW50LnVzZXJuYW1lXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgLy9pZiBjdXJyZW50IGV4aXN0IGluc2lkZSBhY2N1bWlsYXRvciBtYXAgaXQgdG8gdGhhdCBvYmplY3RcbiAgICAgICAgICAgIGFjY3VtdWxhdG9yLnNwbGljZShpbmRleCwgMSwge1xuICAgICAgICAgICAgICAuLi5vYmosXG4gICAgICAgICAgICAgIG1lc3NhZ2VDb3VudDogKytvYmoubWVzc2FnZUNvdW50LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vaWYgY3VycmVudCBleGlzdCBpbnNpZGUgYWNjdW1pbGF0b3IgbWFwIGl0IHRvIHRoYXQgb2JqZWN0XG4gICAgICAgICAgICBhY2N1bXVsYXRvci5wdXNoKHsgLi4uY3VycmVudCwgbWVzc2FnZUNvdW50OiAxIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWNjdW11bGF0b3I7XG4gICAgICB9LCBbXSk7XG59IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IExpc3QsIExpc3RJdGVtIH0gZnJvbSAnLi4vbGF5b3V0L05hdkxpc3QnO1xuaW1wb3J0IHtyZWR1Y2VyVW5yZWFkaGFuZ291dHN9IGZyb20gJy4uL2hhbmdvdXRzL3N0YXRlL3JlZHVjZVVucmVhZGhhbmdvdXRzJ1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVW5yZWFkSGFuZ291dHMoeyB1bnJlYWRoYW5nb3V0cyxvblNlbGVjdFVucmVhZCB9KSB7XG4gIGNvbnN0IFtpdGVtcyxzZXRJdGVtc10gPXVzZVN0YXRlKFtdKVxudXNlRWZmZWN0KCgpPT57XG5pZih1bnJlYWRoYW5nb3V0cyl7XG4gIGNvbnN0IHJlZHVjZWQgPXJlZHVjZXJVbnJlYWRoYW5nb3V0cyh7dW5yZWFkaGFuZ291dHN9KVxuICBzZXRJdGVtcyhyZWR1Y2VkKVxufVxuXG59LFt1bnJlYWRoYW5nb3V0c10pXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPSd1bnJlYWRoYW5nb3V0cyc+XG4gICAgICA8TGlzdD5cbiAgICAgICAge2l0ZW1zICYmXG4gICAgICAgICAgaXRlbXMubGVuZ3RoID4gMCAmJlxuICAgICAgICAgIGl0ZW1zLm1hcCgodSkgPT4ge1xuICAgICAgICAgICAgZGVidWdnZXI7XG4gICAgICAgICAgcmV0dXJuIDxMaXN0SXRlbSBvbkNsaWNrPXtvblNlbGVjdFVucmVhZH0gaWQ9e3UudXNlcm5hbWV9Pnt1LnVzZXJuYW1lfSA8ZGl2IHN0eWxlPXt7Y29sb3I6JyM3MzczNzMnfX0+bWVzc2FnZXM6IHt1Lm1lc3NhZ2VDb3VudH08L2Rpdj48L0xpc3RJdGVtPjtcbiAgICAgICAgICB9KX1cbiAgICAgIDwvTGlzdD5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiJdLCJuYW1lcyI6WyJyZWR1Y2VyVW5yZWFkaGFuZ291dHMiLCJ1bnJlYWRoYW5nb3V0cyIsInJlZHVjZSIsImFjY3VtdWxhdG9yIiwiY3VycmVudCIsImluZGV4IiwibWVzc2FnZUNvdW50Iiwib2JqIiwiZmluZCIsImEiLCJ1c2VybmFtZSIsInN0YXRlIiwiZmluZEluZGV4Iiwic3BsaWNlIiwicHVzaCIsIlVucmVhZEhhbmdvdXRzIiwib25TZWxlY3RVbnJlYWQiLCJpdGVtcyIsInNldEl0ZW1zIiwidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJyZWR1Y2VkIiwibGVuZ3RoIiwibWFwIiwidSIsImNvbG9yIl0sIm1hcHBpbmdzIjoiOztBQUFPLFNBQVNBLHFCQUFULENBQStCO0FBQUNDLEVBQUFBO0FBQUQsQ0FBL0IsRUFBZ0Q7QUFDbkQsU0FBU0EsY0FBYyxDQUFDQyxNQUFmLENBQXNCLENBQUNDLFdBQUQsRUFBY0MsT0FBZCxFQUF1QkMsS0FBdkIsS0FBaUM7QUFDNUQsUUFBSUEsS0FBSyxLQUFLLENBQWQsRUFBaUI7QUFDZixhQUFRRixXQUFXLEdBQUcsQ0FBQyxFQUFFLEdBQUdDLE9BQUw7QUFBY0UsUUFBQUEsWUFBWSxFQUFFO0FBQTVCLE9BQUQsQ0FBdEI7QUFDRCxLQUZELE1BRU87QUFDTCxZQUFNQyxHQUFHLEdBQUdKLFdBQVcsQ0FBQ0ssSUFBWixDQUNUQyxDQUFELElBQU9BLENBQUMsQ0FBQ0MsUUFBRixLQUFlTixPQUFPLENBQUNNLFFBQXZCLElBQW1DTixPQUFPLENBQUNPLEtBQVIsS0FBa0IsV0FEbEQsQ0FBWjs7QUFHQSxVQUFJSixHQUFKLEVBQVM7QUFDUCxjQUFNRixLQUFLLEdBQUdGLFdBQVcsQ0FBQ1MsU0FBWixDQUNYSCxDQUFELElBQU9BLENBQUMsQ0FBQ0MsUUFBRixLQUFlTixPQUFPLENBQUNNLFFBRGxCLENBQWQsQ0FETzs7QUFLUFAsUUFBQUEsV0FBVyxDQUFDVSxNQUFaLENBQW1CUixLQUFuQixFQUEwQixDQUExQixFQUE2QixFQUMzQixHQUFHRSxHQUR3QjtBQUUzQkQsVUFBQUEsWUFBWSxFQUFFLEVBQUVDLEdBQUcsQ0FBQ0Q7QUFGTyxTQUE3QjtBQUlELE9BVEQsTUFTTztBQUNMO0FBQ0FILFFBQUFBLFdBQVcsQ0FBQ1csSUFBWixDQUFpQixFQUFFLEdBQUdWLE9BQUw7QUFBY0UsVUFBQUEsWUFBWSxFQUFFO0FBQTVCLFNBQWpCO0FBQ0Q7QUFDRjs7QUFDRCxXQUFPSCxXQUFQO0FBQ0QsR0F0Qk0sRUFzQkosRUF0QkksQ0FBVDtBQXVCSDs7QUNwQmMsU0FBU1ksY0FBVCxDQUF3QjtBQUFFZCxFQUFBQSxjQUFGO0FBQWlCZSxFQUFBQTtBQUFqQixDQUF4QixFQUEyRDtBQUN4RSxRQUFNLENBQUNDLEtBQUQsRUFBT0MsUUFBUCxJQUFrQkMsQ0FBUSxDQUFDLEVBQUQsQ0FBaEM7QUFDRkMsRUFBQUEsQ0FBUyxDQUFDLE1BQUk7QUFDZCxRQUFHbkIsY0FBSCxFQUFrQjtBQUNoQixZQUFNb0IsT0FBTyxHQUFFckIscUJBQXFCLENBQUM7QUFBQ0MsUUFBQUE7QUFBRCxPQUFELENBQXBDO0FBQ0FpQixNQUFBQSxRQUFRLENBQUNHLE9BQUQsQ0FBUjtBQUNEO0FBRUEsR0FOUSxFQU1QLENBQUNwQixjQUFELENBTk8sQ0FBVDtBQVFFLFNBQ0U7QUFBSyxtQkFBWTtBQUFqQixLQUNFLEVBQUMsSUFBRCxRQUNHZ0IsS0FBSyxJQUNKQSxLQUFLLENBQUNLLE1BQU4sR0FBZSxDQURoQixJQUVDTCxLQUFLLENBQUNNLEdBQU4sQ0FBV0MsQ0FBRCxJQUFPO0FBQ2Y7QUFDRixXQUFPLEVBQUMsUUFBRDtBQUFVLE1BQUEsT0FBTyxFQUFFUixjQUFuQjtBQUFtQyxNQUFBLEVBQUUsRUFBRVEsQ0FBQyxDQUFDZDtBQUF6QyxPQUFvRGMsQ0FBQyxDQUFDZCxRQUF0RCxPQUFnRTtBQUFLLE1BQUEsS0FBSyxFQUFFO0FBQUNlLFFBQUFBLEtBQUssRUFBQztBQUFQO0FBQVoscUJBQTBDRCxDQUFDLENBQUNsQixZQUE1QyxDQUFoRSxDQUFQO0FBQ0MsR0FIRCxDQUhKLENBREYsQ0FERjtBQVlEOzs7OyJ9
