package com.benua.backend.migration;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Запускает миграцию данных из JSON в MongoDB один раз при старте приложения.
 */
@Component
public class DataMigrationRunner implements CommandLineRunner {

    private final DataMigrationService migrationService;

    public DataMigrationRunner(DataMigrationService migrationService) {
        this.migrationService = migrationService;
    }

    @Override
    public void run(String... args) {
        migrationService.migrate();
    }
}
