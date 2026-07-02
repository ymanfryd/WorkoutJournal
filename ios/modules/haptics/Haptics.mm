//
//  Haptics.mm
//  WorkoutJournal
//
//  Created by mac on 02.07.2026.
//

#import "Haptics.h"


@implementation Haptics {
  UIImpactFeedbackGenerator *_impactLight;
  UIImpactFeedbackGenerator *_impactMedium;
  UIImpactFeedbackGenerator *_impactHeavy;
  UINotificationFeedbackGenerator *_notification;
  UISelectionFeedbackGenerator *_selection;
}

RCT_EXPORT_MODULE()

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeHapticsSpecJSI>(params);
}

- (instancetype)init {
  self = [super init];
  if (self) {
    _impactLight = [[UIImpactFeedbackGenerator alloc] initWithStyle:UIImpactFeedbackStyleLight];
    _impactMedium = [[UIImpactFeedbackGenerator alloc] initWithStyle:UIImpactFeedbackStyleMedium];
    _impactHeavy = [[UIImpactFeedbackGenerator alloc] initWithStyle:UIImpactFeedbackStyleHeavy];
    _notification = [[UINotificationFeedbackGenerator alloc] init];
    _selection = [[UISelectionFeedbackGenerator alloc] init];
    [_impactLight prepare];
    [_impactMedium prepare];
    [_impactHeavy prepare];
    [_notification prepare];
    [_selection prepare];
  }
  return self;
}

- (void)impact:(nonnull NSString *)style { 
  if ([style isEqualToString:@"light"]) [_impactLight impactOccurred];
  else if ([style isEqualToString:@"medium"]) [_impactMedium impactOccurred];
  else if ([style isEqualToString:@"heavy"]) [_impactHeavy impactOccurred];
}


- (void)notification:(nonnull NSString *)type { 
  UINotificationFeedbackType t = UINotificationFeedbackTypeSuccess;
   if ([type isEqualToString:@"warning"]) t = UINotificationFeedbackTypeWarning;
   else if ([type isEqualToString:@"error"]) t = UINotificationFeedbackTypeError;
   [_notification notificationOccurred:t];
}

- (void)selection {
  [_selection selectionChanged];
}

+ (BOOL)requiresMainQueueSetup {
  return NO;
}


@end
