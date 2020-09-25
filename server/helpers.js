module.exports.undefinedArguments = function () {
  try {
    let args = Array.from(arguments);
    for (const [key, value] of Object.entries(args[0])) {
      if (value === undefined) {
        throw new Error(`==UNDEFINED ARGUMENT PASSED FOR==":${key}" parameter`);
      }
    }
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
};
