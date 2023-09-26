import { faker } from "@faker-js/faker";
import { sample } from "lodash";

// ----------------------------------------------------------------------

const users = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  duration1: faker.datatype.number(),
  duration2: faker.datatype.number(),
  s1: (faker.datatype.number() % 200) / 10 - 10,
  s2: (faker.datatype.number() % 200) / 10 - 10,
}));

export default users;
