import { useState } from "react";
import { PropertyTree } from "./PropertyTree";
import { PropertyType } from "./PropertyType";
import type { ResourceDefinition } from "@lib/kube";
import { twMerge } from "tailwind-merge";

type Props = {
  scope: string;
  path: string;
  name: string;
  type: string;
  required: boolean;
  description: string;
  definition?: ResourceDefinition;
  level: number;
};

export function PropertyRow(props: Props) {
  const [showDescription, setShowDescription] = useState(false);
  const toggleShowDescription = () => setShowDescription((x) => !x);

  // Top level objects should start expanded, expect for metadata
  const [showChildren, setShowChildren] = useState(
    props.level === 0 && props.type !== "ObjectMeta"
  );
  const toggleShowChildren = () => setShowChildren((x) => !x);

  const hasDescription = !!props.description;

  const hasChildren =
    Object.keys(props.definition?.properties || {}).length > 0;

  const isRequired =
    props.required ||
    (props.scope === "Namespaced" && props.path === ".metadata.namespace");

  return (
    <li key={props.name} className="text-sm font-semibold">
      <button
        onClick={toggleShowDescription}
        className={twMerge(
          "inline-block cursor-default rounded-lg px-1",
          hasDescription ? "cursor-pointer hover:bg-accent" : ""
        )}
      >
        {isRequired ? (
          <span className="text-destructive text-xs mr-0.5">*</span>
        ) : (
          ""
        )}
        {props.name}
      </button>

      <button
        onClick={toggleShowChildren}
        className={twMerge(
          "inline-block cursor-default rounded-lg px-1",
          hasChildren ? "cursor-pointer hover:bg-accent" : ""
        )}
      >
        <PropertyType
          type={props.type}
          hasChildren={hasChildren}
          className="text-sm"
        />
      </button>

      {showDescription && hasDescription && (
        <pre className="ml-1 mb-2 max-w-4xl whitespace-pre-line text-xs font-normal">
          {props.description}
        </pre>
      )}

      {showChildren && hasChildren && props.definition && (
        <PropertyTree
          scope={props.scope}
          path={props.path}
          definition={props.definition}
          level={props.level + 1}
        />
      )}
    </li>
  );
}
