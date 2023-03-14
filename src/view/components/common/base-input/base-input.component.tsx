import styled from "styled-components";
import {IBaseInput} from "./base-input.types";

export const BaseInput: React.FC<IBaseInput> = ({label, value, disabled = false}) => {
    return (
        <Label>
            {label}
            <Input type="text" value={value} disabled={disabled}/>
        </Label>
    )
}

const Label = styled.label`
  font-weight: 500;
  color: dimgrey;
  display: flex;
  flex-direction: column;
`

const Input = styled.input`
  padding: 10px;
  border: 1px solid black;
  margin-top: 5px;
  width: 300px;
`
