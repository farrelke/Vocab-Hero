import * as React from "react";
import { PureComponent } from 'react';
import "./AddWords.scss"

type Props = {}

class AddWords extends PureComponent<Props> {
  state = {
    quickAdd: false
  };

  render() {


    return (
      <div className="AddWords">

        <div className="AddWords__title" >Add Vocab</div>
        <label>
          Name:
          <input type="text" name="name" />
        </label>
        <div className="AddWords__submit" >Add</div>
      </div>
    );
  }
}

export default AddWords;
