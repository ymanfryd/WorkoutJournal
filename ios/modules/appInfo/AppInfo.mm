//
//  AppInfo.mm
//  WorkoutJournal
//
//  Created by mac on 26.05.2026.
//
#import "AppInfo.h"


@implementation AppInfo

RCT_EXPORT_MODULE()

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeAppInfoSpecJSI>(params);
}

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

- (nonnull NSString *)getBuildNumber {
  NSString *version = [[NSBundle mainBundle] infoDictionary][@"CFBundleVersion"];
  return version;

}

- (nonnull NSString *)getBundleId {
  NSString *bundleId = [[NSBundle mainBundle] infoDictionary][@"CFBundleIdentifier"];
  return bundleId;
}

- (nonnull NSString *)getVersion { 
  NSString *version = [[NSBundle mainBundle] infoDictionary][@"CFBundleShortVersionString"];
  return version;
}

@end
