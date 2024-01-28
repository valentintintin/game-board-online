using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Common.Extensions;

public static class ValueConversionExtension
{
    private static readonly JsonSerializerOptions Options = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = true,
        AllowTrailingCommas = true,
        PropertyNameCaseInsensitive = true
    };

    public static PropertyBuilder<T?> HasJsonConversion<T>(this PropertyBuilder<T?> propertyBuilder) where T : class, new()
    {
        if (!Options.Converters.Any())
        {
            Options.Converters.Add(new JsonStringEnumConverter());
        }

        ValueConverter<T?, string> converter = new(
            v => JsonSerializer.Serialize(v, Options),
            v => JsonSerializer.Deserialize<T>(v, Options)
        );

        ValueComparer<T?> comparer = new(
            (l, r) => JsonSerializer.Serialize(l, Options) == JsonSerializer.Serialize(r, Options),
            v => JsonSerializer.Serialize(v, Options).GetHashCode(),
            v => JsonSerializer.Deserialize<T>(JsonSerializer.Serialize(v, Options), Options)
        );

        propertyBuilder.HasConversion(converter);
        propertyBuilder.Metadata.SetValueConverter(converter);
        propertyBuilder.Metadata.SetValueComparer(comparer);
        propertyBuilder.HasColumnType("jsonb");

        return propertyBuilder;
    }

    public static PropertyBuilder<T> HasJsonConversionRequired<T>(this PropertyBuilder<T> propertyBuilder) where T : class, new()
    {
        if (!Options.Converters.Any())
        {
            Options.Converters.Add(new JsonStringEnumConverter());
        }

        ValueConverter<T, string> converter = new(
            v => JsonSerializer.Serialize(v, Options),
            v => JsonSerializer.Deserialize<T>(v, Options)!
        );

        ValueComparer<T> comparer = new(
            (l, r) => JsonSerializer.Serialize(l, Options) == JsonSerializer.Serialize(r, Options),
            v => JsonSerializer.Serialize(v, Options).GetHashCode(),
            v => JsonSerializer.Deserialize<T>(JsonSerializer.Serialize(v, Options), Options)!
        );

        propertyBuilder.HasConversion(converter);
        propertyBuilder.Metadata.SetValueConverter(converter);
        propertyBuilder.Metadata.SetValueComparer(comparer);
        propertyBuilder.HasColumnType("jsonb");

        return propertyBuilder;
    }
}