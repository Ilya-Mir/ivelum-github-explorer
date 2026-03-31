interface Owner {
  __typename: string;
  login: string;
}

interface Node {
  __typename: string;
  name: string;
  owner: Owner;
}

interface SearchResultItemEdge {
  __typename: string;
  cursor: string;
  node: Node;
}
