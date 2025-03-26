import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface CreditCard {
  id: string;
  holderName: string;
  lastFourDigits: string;
  expiryDate: string;
}

export default function CreditCardList() {
  const cards: CreditCard[] = [
    {
      id: "1",
      holderName: "أحمد جمال",
      lastFourDigits: "20",
      expiryDate: "05/2000",
    },
    {
      id: "2",
      holderName: "أحمد جمال",
      lastFourDigits: "20",
      expiryDate: "05/2000",
    },
  ];

  return (
    <div className="flex flex-col w-full gap-4 px-8 py-20 mx-auto bg-background rounded-xl">
      {cards.map((card) => (
        <Card
          key={card.id}
          className="flex justify-between p-4 border lg:px-28 lg:py-10 border-border rounded-xl"
        >
          <div className="flex items-center gap-4">
            <div className="w-[50px] h-auto">
              <Image
                src="/Logo/logos_visa.png"
                alt="Visa Logo"
                className="w-full h-auto"
                width={200}
                height={200}
              />
            </div>

            <div className="flex flex-col gap-3 text-right lg:flex-row lg:gap-10">
              <h3 className="text-lg font-medium">{card.holderName}</h3>
              <p className="text-sm text-gray-600">
                **** **** **** {card.lastFourDigits}
              </p>
              <p className="text-sm text-gray-600">{card.expiryDate}</p>
            </div>
          </div>

          <Button
            variant={"ghost"}
            className="p-2 transition-colors rounded-full "
          >
            <Link href="/user/payment/edit-payment">
              <Image
                src="/Icons/pencil-edit-02.png"
                alt="Edit"
                width={24}
                height={24}
              />
            </Link>
          </Button>
        </Card>
      ))}

      <Button variant="secondary" className="h-12 mx-auto md:px-20 ">
        <Link href="/user/payment/add-payment">اضف بطاقة جديدة</Link>
      </Button>
    </div>
  );
}
