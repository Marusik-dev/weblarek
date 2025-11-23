import { IBuyer, TPayment } from "../../types";

export class Buyer {
  private payment: TPayment = '';
  private email: string = '';
  private phone: string = '';
  private address: string = '';

  constructor(data?: IBuyer) {
    this.payment = data?.payment || '';
    this.email = data?.email || '';
    this.phone = data?.phone || '';
    this.address = data?.address || '';
  }

  setData(data: IBuyer): void {
    this.payment = data.payment ?? this.payment;
    this.email = data.email ?? this.email;
    this.phone = data.phone ?? this.phone;
    this.address = data.address ?? this.address;
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  setPayment(payment: TPayment): void {
    this.payment = payment;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  setPhone(phone: string): void {
    this.phone = phone;
  }

  setAddress(address: string): void {
    this.address = address;
  }

  clear(): void {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
  }

  removeData(): void {
    this.clear();
  }

  validate(): {
    payment: boolean;
    email: boolean;
    phone: boolean;
    address: boolean;
  } {
    return {
      payment: this.payment !== '',
      email: this.email.includes('@') && this.email.length > 3,
      phone: this.phone.length >= 10 && /^[\d+\-\s()]+$/.test(this.phone),
      address: this.address.length > 5,
    };
  }

  validateContactsForm(): { error: string; isValid: boolean } {
    const emailValid = this.email.includes('@') && this.email.length > 3;
    const phoneValid = this.phone.length >= 10 && /^[\d+\-\s()]+$/.test(this.phone);
    
    if (!emailValid && !phoneValid) {
      return { error: 'Email и телефон обязательны', isValid: false };
    }
    if (!emailValid) {
      return { error: 'Введите корректный email', isValid: false };
    }
    if (!phoneValid) {
      return { error: 'Телефон должен содержать не менее 10 цифр', isValid: false };
    }
    
    return { error: '', isValid: true };
  }

  validateAddressForm(): { error: string; isValid: boolean } {
    const paymentValid = this.payment !== '';
    const addressValid = this.address.length > 5;
    
    if (!paymentValid && !addressValid) {
      return { error: 'Выберите способ оплаты и введите адрес', isValid: false };
    }
    if (!paymentValid) {
      return { error: 'Выберите способ оплаты', isValid: false };
    }
    if (!addressValid) {
      return { error: 'Адрес должен содержать не менее 5 символов', isValid: false };
    }
    
    return { error: '', isValid: true };
  }

  get isValid(): boolean {
    const validation = this.validate();
    return Object.values(validation).every(Boolean);
  }
}