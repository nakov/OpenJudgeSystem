namespace OJS.Workers.Common.Exceptions;

public class InvalidSettingException(string message, string settingName)
    : Exception(message + " Setting name: " + settingName);