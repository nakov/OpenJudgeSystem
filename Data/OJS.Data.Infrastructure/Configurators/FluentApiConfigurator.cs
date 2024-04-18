namespace OJS.Data.Infrastructure.Configurators
{
    using System;
    using System.Linq;
    using System.Reflection;
    using Microsoft.EntityFrameworkCore;

    internal class FluentApiConfigurator
    {
        private readonly MethodInfo configurationMethodInfo;
        private readonly Type configurationType;

        public FluentApiConfigurator(
            MethodInfo configurationMethodInfo,
            Type configurationType)
        {
            this.configurationMethodInfo = configurationMethodInfo;
            this.configurationType = configurationType;
        }

        public void Configure(object dbContext, Type entityType, ModelBuilder modelBuilder)
        {
            var typeIsAssignableToBaseType =
                IsTypeAssignableFromConfigurationType(entityType, this.configurationType, out var idType);

            if (!typeIsAssignableToBaseType || !this.ConfigurationIsApplicable(entityType))
            {
                return;
            }

            var configurationMethod = idType == null
                ? this.configurationMethodInfo.MakeGenericMethod(entityType)
                : this.configurationMethodInfo.MakeGenericMethod(entityType, idType);

            configurationMethod.Invoke(dbContext, new object[] { modelBuilder });
        }

        protected virtual bool ConfigurationIsApplicable(Type entityType) => true;

        private static bool IsTypeAssignableFromConfigurationType(Type entityType, Type baseType, out Type? idType)
        {
            idType = null;

            var entityBaseType = entityType.BaseType;
            while (entityBaseType != null && entityBaseType != typeof(object))
            {
                if (entityBaseType.IsGenericType &&
                    baseType.IsGenericType &&
                    entityBaseType.GetGenericTypeDefinition() == baseType.GetGenericTypeDefinition())
                {
                    idType = entityBaseType.GetGenericArguments().First();
                    return true;
                }

                entityBaseType = entityBaseType.BaseType;
            }

            return baseType.IsAssignableFrom(entityType);
        }
    }
}