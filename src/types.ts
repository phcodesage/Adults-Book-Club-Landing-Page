export type BookSelection = {
  id: string;
  monthLabel: string;
  monthIndex: number;
  year: number;
  imageSrc: string;
  imageAlt: string;
  title: string;
  author: string;
  schedule: string;
};

export type SiteContent = {
  siteName: string;
  sectionTitle: string;
  logoSrc: string;
  heroImageSrc: string;
  heroImageAlt: string;
  priceLabel: string;
  registrationLink: string;
  registrationCtaLabel: string;
  registrationClosedLabel: string;
  cardCtaLabel: string;
  cardClosedLabel: string;
  introQuote: string;
  footerText: string;
  books: BookSelection[];
};

export type MediaItem = {
  id: string;
  name: string;
  src: string;
  type: 'image' | 'video';
  origin: 'seeded' | 'upload';
  uploadedAt: string;
};

export type DeviceType = 'Desktop' | 'Mobile' | 'Tablet';

export type AnalyticsVisit = {
  id: string;
  path: string;
  deviceType: DeviceType;
  country: string;
  visitedAt: string;
};

export type PaymentStatus = 'pending' | 'verified' | 'rejected';

export type ZellePayment = {
  _id?: string;
  courseName: string;
  customerName: string;
  phoneNumber: string;
  referenceNumber: string;
  amount: string;
  screenshotUrl?: string;
  status: PaymentStatus;
  submittedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
  notes?: string;
};
