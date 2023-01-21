import React, {useState} from 'react';
import {useOutletContext} from "react-router-dom";
import {BodyContext} from "../types";

export default function Home() {
  const {program} = useOutletContext<BodyContext>();
  const [bounties, setBounties] = useState([]);

  return (
    <span>thing</span>
  );
}