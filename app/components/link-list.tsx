import React from "react";
import Link from "next/link";
import Spinner from "./spinner";
import { linkList } from "../types/link-list-item";

const LinkList = (props: { title: string; list: linkList[] }) => {
  return props.list.length > 0 ? (
    <>
      <section className="section">
        <header className="section-header">
          <h3>{props.title}</h3>
        </header>

        <ul className="link-list">
          {props.list.map((item, index) => (
            <li key={index}>
              <Link href={item.Destination}>{item.Title}</Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  ) : (
    <>
      <Spinner />
    </>
  );
};

export default LinkList;
