"use client";

import React, { useState } from "react";
import { Field, Label, Switch } from "@headlessui/react";
import UserCircleIcon from "@/app/icons/user-circle.svg";
import BellIcon from "@/app/icons/bell.svg";
import ShieldCheckIcon from "@/app/icons/shield-check.svg";
import Image from "next/image";
import { useAccount } from "wagmi";

// Utility function for conditional class names
const classNames = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

type NotificationPreferences = {
  email: boolean;
  push: boolean;
  sms: boolean;
};

type SecuritySettings = {
  twoFactor: boolean;
  passwordReset: boolean;
};

const SettingsAndAccount: React.FC = () => {
  const { address } = useAccount();
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    email: true,
    push: false,
    sms: true,
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactor: false,
    passwordReset: true,
  });

  const toggleNotification = (key: keyof NotificationPreferences) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSecurity = (key: keyof SecuritySettings) => {
    setSecurity((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="container mx-auto p-4 h-[calc(100vh-80px)]">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-palette-foreground mb-8">
          Settings & Account
        </h1>

        {/* Account Information */}
        <section className="bg-white p-6 mb-8">
          <h2 className="text-xl font-semibold text-palette-foreground mb-4 flex items-center">
            <Image
              src={UserCircleIcon}
              alt="UserCircleIcon"
              className="h-6 w-6 mr-2 text-indigo-500"
            />
            Account Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <p className="mt-1 text-sm text-palette-foreground">
                jordan.base.eth
              </p>
            </div>
            {address && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <p className="mt-1 text-sm text-palette-foreground">
                  {address.substring(0, 6)}...
                  {address.substring(address.length - 4)}
                </p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Joined
              </label>
              <p className="mt-1 text-sm text-palette-foreground">
                January 1, 2023
              </p>
            </div>
          </div>
        </section>

        {/* Notification Preferences */}
        <section className="bg-white p-6 mb-8">
          <h2 className="text-xl font-semibold text-palette-foreground mb-4 flex items-center">
            <Image
              src={BellIcon}
              alt="bell"
              className="h-6 w-6 mr-2 text-indigo-500"
            />
            Notification Preferences
          </h2>
          <div className="space-y-4">
            {(
              Object.keys(notifications) as Array<keyof NotificationPreferences>
            ).map((key) => (
              <Field
                key={key}
                className="flex flex-row text-sm font-medium text-palette-foreground gap-2 items-center"
              >
                <Label>
                  {key.charAt(0).toUpperCase() + key.slice(1)} Notifications
                </Label>
                <Switch
                  checked={notifications[key]}
                  onChange={() => toggleNotification(key)}
                  className={classNames(
                    notifications[key] ? "bg-indigo-600" : "bg-gray-200",
                    "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-black transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      notifications[key] ? "translate-x-5" : "translate-x-0",
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-whitetransition duration-200 ease-in-out"
                    )}
                  />
                </Switch>
              </Field>
            ))}
          </div>
        </section>

        {/* Security Settings */}
        <section className="bg-white p-6">
          <h2 className="text-xl font-semibold text-palette-foreground mb-4 flex items-center">
            <Image
              src={ShieldCheckIcon}
              alt="ShieldCheckIcon"
              className="h-6 w-6 mr-2 text-indigo-500"
            />
            Security Settings
          </h2>
          <div className="space-y-4">
            {(Object.keys(security) as Array<keyof SecuritySettings>).map(
              (key) => (
                <Field
                  key={key}
                  className="flex flex-row text-sm font-medium text-palette-foreground gap-2 items-center"
                >
                  <Label>
                    {key === "twoFactor"
                      ? "Two-Factor Authentication"
                      : "Password Reset Reminders"}
                  </Label>
                  <Switch
                    checked={security[key]}
                    onChange={() => toggleSecurity(key)}
                    className={classNames(
                      security[key] ? "bg-indigo-600" : "bg-gray-200",
                      "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={classNames(
                        security[key] ? "translate-x-5" : "translate-x-0",
                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-whitetransition duration-200 ease-in-out"
                      )}
                    />
                  </Switch>
                </Field>
              )
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsAndAccount;
