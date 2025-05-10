// deno-fmt-ignore-file
import type {
  ComponentType,
  MoleculeNameType,
} from "../mod.ts";
import { BookingsType, DetailsProductType } from "@mongo";
import { Handler, Helper } from "@utils";

type ParameterType = {
  details: DetailsProductType;
  lastBooking: BookingsType;
};

export const BookingDetails: ComponentType<
  MoleculeNameType,
  (arg: ParameterType) => string
> = {
  name: "BookingDetails",
  html: ({
    details,
    lastBooking,
  }: ParameterType) => {
    const {
      isAvailable,
      endingDate
    } = Handler.getProductAvailability(lastBooking);
    
    return `
    <div>
      <span> 
        <strong>
          ${Helper.formatPrice(details.price)}
        </strong>
        la nuit
      </span>
      <span
        data-available="${isAvailable}"
      >
        <span>
        </span>
        <strong>
        ${
          isAvailable
          ? "disponible"
          : `disponible à partir du ${Helper.displayDate({
            date: endingDate,
            style: "short"
          })}`
        }
        </strong>
      </span>
    </div>
    `
  },
};
