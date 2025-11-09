import { City } from "../../locations/location.service";
import { State } from "../../locations/location.service";
import { Country } from "../../locations/location.service";
export class BudgetShipping {
  id: number;
  address: string;
  budgetId: number;
  cityId: number;
  stateId: number;
  countryId: number;
  email: string;

  city?: City;
  state?: State;
  country?: Country;
}
