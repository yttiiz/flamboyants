// deno-lint-ignore-file no-explicit-any
export type TemplateNameType = "Header" | "Main" | "Footer";

export type OrganismNameType =
  | "SectionAuthForm"
  | "SectionAdmin"
  | "SectionsProfilForm"
  | "SectionsBooking"
  | "SectionsProduct"
  | "SectionsHome"
  | "SectionErrorHome"
  | "BookingCard"
  | "AdminDashboard"
  | "DashboardCard"
  | "SectionContact"
  | "ProductCard";

export type MoleculeNameType =
  | "BookingForm"
  | "BookingDetails"
  | "DeleteAccount"
  | "DeleteForm"
  | "DeleteAccountForm"
  | "InputsForm"
  | "InputsGroupForm"
  | "HeaderNavigation"
  | "HeaderUserSession"
  | "HeaderAdminSession"
  | "HeroBanner"
  | "TextAreaForm"
  | "LoadingVisitCards"
  | "Login"
  | "LogoutUserForm"
  | "LogoutAdminForm"
  | "ProductDetails"
  | "ProductFigure"
  | "RateStars"
  | "Dialog"
  | "DialogForm"
  | "ReviewsDetails"
  | "FormReview"
  | "FormAdmin"
  | "Text"
  | "NotFound"
  | "PicturesSlider";

export type AtomNameType =
  | "LikeSvg"
  | "ShareSvg"
  | "ShareForm"
  | "StarSvg"
  | "UserSvg"
  | "DangerSvg"
  | "Logo"
  | "LoginRegister"
  | "EyeOpenSvg"
  | "EyeShutSvg"
  | "CircleSvg"
  | "OnOffSvg";

export type ComponentType<
  T extends
    | TemplateNameType
    | OrganismNameType
    | MoleculeNameType
    | AtomNameType
    | "Body" = "Body",
  U extends
    | string
    | (<A extends (...args: any) => any>(
      arg: Parameters<A>,
    ) => string | Promise<string>) = string,
> = {
  name: T;
  html: U;
};

export type ItemDataType = {
  link: string;
  text: string;
  className?: string;
};

export type SubMenuDataType = {
  name: string;
  relatedItems: ItemDataType[];
};

export type ItemDataTypeAndUserRelationship =
  & (
    | ItemDataType
    | SubMenuDataType
  )
  & {
    isRelatedToUser: boolean;
  };

export type TitleAndDescriptionType = {
  title: string;
  paragraph: string;
};

export type ButtonType = {
  btnText: string;
  btnLink?: string;
};

export type InformativeContentAndButtonType =
  & ButtonType
  & TitleAndDescriptionType;

export type FormAttributesType = {
  action: string;
  method: string;
};

export type ProductDescriptionType = {
  type: string;
  area: string;
  rooms: string;
};

export type HomePageDataType = {
  hero: TitleAndDescriptionType & {
    imgSrc: string;
    imgAlt: string;
  };
  appartment: TitleAndDescriptionType;
  visit: {
    title: string;
  };
};

export type CommonInputType = {
  name?: string;
  required?: string;
  disabled?: string;
  value?: string;
};

export type InputDataType = CommonInputType & {
  type: string;
  label?: string;
  placeholder?: string;
  maxLength?: string;
  minLength?: string;
  accept?: string;
  autocomplete?: string;
  items?: string[] | CommonInputType[];
};

export type InputFormPropsType = {
  content: InputDataType[];
  isProfilInputs?: boolean;
  date?: string;
};

export type InputGroupFormPropsType = Omit<InputFormPropsType, "date">;

export type OpenGraphDataType = {
  title: string;
  type: string;
  url: string;
  image: {
    url: string;
    type: string;
    width: string;
    height: string;
  };
};

export type HeadPageDataType = {
  title: string;
  description?: string;
  openGraph?: OpenGraphDataType;
};

export type HeaderDataType = {
  logo: ItemDataType;
  items: ItemDataTypeAndUserRelationship[];
  login: ItemDataType[];
};

export type FooterDataType = {
  basicItems: ItemDataType[];
  relatedItems: ItemDataType[];
  copyrights: string;
};

export type DialogDataType = {
  dataset?: string;
  component?: string;
};

export type FormDataType = FormAttributesType & {
  title: string;
  content: InputDataType[];
  changePhoto?: string;
};

export type DashboardDetailsType = {
  title: string;
  className: string;
  isAccordeon: boolean;
};

export type DashboardDataType = {
  title: string;
  analytics: DashboardDetailsType;
  users: DashboardDetailsType;
  products: DashboardDetailsType;
  bookings: DashboardDetailsType;
};

export type DeleteAccountDataType = {
  deleteAccount: InformativeContentAndButtonType;
  deleteModal: InformativeContentAndButtonType & FormAttributesType;
};

export type CancelBookingFormType =
  & FormAttributesType
  & Pick<ButtonType, "btnText">;

export type BookingCardDataType = {
  createdAtTitle: string;
  periodTitle: string;
  details: ProductDescriptionType;
  amount: string;
  cancelBookingForm: CancelBookingFormType;
};

export type BookingDataType = {
  title: string;
  card: BookingCardDataType;
};

export type ProductDataType = {
  images: {
    legend: string;
  };
  description: {
    title: string;
    infos: ProductDescriptionType;
  };
  booking: FormDataType;
  reviewsAndRate: {
    title: string;
    empty: string;
  };
  conditions: {
    title: string;
    content: string;
  };
  reviewForm: FormDataType;
};

export type NotFoundDataType = InformativeContentAndButtonType;
