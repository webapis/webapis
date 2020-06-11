export function reducerUnreadhangouts({unreadhangouts}){
    return   unreadhangouts.reduce((accumulator, current, index) => {
        if (index === 0) {
          return (accumulator = [{ ...current, messageCount: 1 }]);
        } else {
          const obj = accumulator.find(
            (a) => a.username === current.username && current.state === 'MESSANGER'
          );
          if (obj) {
            const index = accumulator.findIndex(
              (a) => a.username === current.username
            );
            //if current exist inside accumilator map it to that object
            accumulator.splice(index, 1, {
              ...obj,
              messageCount: ++obj.messageCount,
            });
          } else {
            //if current exist inside accumilator map it to that object
            accumulator.push({ ...current, messageCount: 1 });
          }
        }
        return accumulator;
      }, []);
}