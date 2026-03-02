import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Skeleton } from '@/components/ui/skeleton';
import { CompactCalendar } from '@/modules/home/dashboard/components/compact-calendar';

export const WelcomeBannerFallback = () => {
  return (
    <div className="flex flex-col items-start max-lg:w-full sm:flex-row sm:items-center lg:flex-col lg:items-start">
      <div className="my-auto h-fit space-y-2 max-lg:w-full">
        <h1 className="text-2xl leading-none font-bold tracking-tight">
          WELCOME BACK!
        </h1>
        <Skeleton className="mb-8 h-5 w-2/3 max-sm:mb-4" />
      </div>
      <div className="mx-auto flex w-full flex-col space-y-3 sm:w-fit">
        <h2 className="text-muted-foreground text-sm font-medium tracking-wider uppercase max-lg:hidden">
          Calendar
        </h2>
        <Calendar
          mode="single"
          className="ring-border/20 mb-0 rounded-lg border ring-3 max-lg:hidden"
        />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="pointer-events-none size-17 rounded-lg bg-transparent! max-md:hidden lg:hidden"
          >
            <CalendarIcon className="text-muted-foreground size-10" />
          </Button>
          <CompactCalendar className="w-full justify-center sm:w-fit lg:hidden" />
        </div>
      </div>
    </div>
  );
};
