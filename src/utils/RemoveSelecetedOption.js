function RemoveSelectedOption(
  index,
  options, // all options in array of objects
  selectedOptions, // selected options in array of objects
  option_id,
  match_id = option_id
) {
  let renderedOptions = options.filter(
    (item) =>
      !selectedOptions.some((selected, i) => {
        return item[option_id] == selected[match_id] && i != index;
      })
  );
  return renderedOptions;
}

export default RemoveSelectedOption;
