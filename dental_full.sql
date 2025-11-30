--
-- PostgreSQL database dump
--

\restrict 4Ed9fe7lavQjMTTbECYNhNuZohBAgYPN1mtj6y3j0zGyNy0fuXNlXbacrRVByGi

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP POLICY IF EXISTS "Verificar código público" ON "public"."codigos_invitacion";
DROP POLICY IF EXISTS "Users can update their own personal record" ON "public"."personal";
DROP POLICY IF EXISTS "Solo administradores pueden modificar ajustes" ON "public"."ajustes_aplicacion";
DROP POLICY IF EXISTS "Servicio imágenes lectura pública" ON "public"."cms_servicio_imagenes";
DROP POLICY IF EXISTS "Servicio imágenes admin write" ON "public"."cms_servicio_imagenes";
DROP POLICY IF EXISTS "Personal visible para autenticados" ON "public"."personal";
DROP POLICY IF EXISTS "Personal modificable para autenticados" ON "public"."personal";
DROP POLICY IF EXISTS "Personal delete by authenticated" ON "public"."personal";
DROP POLICY IF EXISTS "Lectura de secuencia para usuarios autenticados" ON "public"."numero_historia_secuencia";
DROP POLICY IF EXISTS "Enable all for authenticated users" ON "public"."presupuestos";
DROP POLICY IF EXISTS "Enable all for authenticated users" ON "public"."presupuesto_items";
DROP POLICY IF EXISTS "Códigos invitación admin" ON "public"."codigos_invitacion";
DROP POLICY IF EXISTS "Config seguridad lectura pública" ON "public"."config_seguridad";
DROP POLICY IF EXISTS "Config seguridad admin write" ON "public"."config_seguridad";
DROP POLICY IF EXISTS "Chatbot conv insert público" ON "public"."chatbot_conversaciones";
DROP POLICY IF EXISTS "Chatbot conv admin read" ON "public"."chatbot_conversaciones";
DROP POLICY IF EXISTS "Chatbot contexto read" ON "public"."chatbot_contexto";
DROP POLICY IF EXISTS "Chatbot contexto admin write" ON "public"."chatbot_contexto";
DROP POLICY IF EXISTS "Chatbot FAQs read" ON "public"."chatbot_faqs";
DROP POLICY IF EXISTS "Chatbot FAQs admin write" ON "public"."chatbot_faqs";
DROP POLICY IF EXISTS "CMS tema público" ON "public"."cms_tema";
DROP POLICY IF EXISTS "CMS tema admin write" ON "public"."cms_tema";
DROP POLICY IF EXISTS "CMS servicios read" ON "public"."cms_servicios";
DROP POLICY IF EXISTS "CMS servicios admin write" ON "public"."cms_servicios";
DROP POLICY IF EXISTS "CMS secciones read" ON "public"."cms_secciones";
DROP POLICY IF EXISTS "CMS secciones admin write" ON "public"."cms_secciones";
DROP POLICY IF EXISTS "CMS equipo read" ON "public"."cms_equipo";
DROP POLICY IF EXISTS "CMS equipo admin write" ON "public"."cms_equipo";
DROP POLICY IF EXISTS "CMS carrusel read" ON "public"."cms_carrusel";
DROP POLICY IF EXISTS "CMS carrusel admin write" ON "public"."cms_carrusel";
DROP POLICY IF EXISTS "Ajustes son visibles para todos los usuarios autenticados" ON "public"."ajustes_aplicacion";
ALTER TABLE IF EXISTS ONLY "storage"."vector_indexes" DROP CONSTRAINT IF EXISTS "vector_indexes_bucket_id_fkey";
ALTER TABLE IF EXISTS ONLY "storage"."s3_multipart_uploads_parts" DROP CONSTRAINT IF EXISTS "s3_multipart_uploads_parts_upload_id_fkey";
ALTER TABLE IF EXISTS ONLY "storage"."s3_multipart_uploads_parts" DROP CONSTRAINT IF EXISTS "s3_multipart_uploads_parts_bucket_id_fkey";
ALTER TABLE IF EXISTS ONLY "storage"."s3_multipart_uploads" DROP CONSTRAINT IF EXISTS "s3_multipart_uploads_bucket_id_fkey";
ALTER TABLE IF EXISTS ONLY "storage"."prefixes" DROP CONSTRAINT IF EXISTS "prefixes_bucketId_fkey";
ALTER TABLE IF EXISTS ONLY "storage"."objects" DROP CONSTRAINT IF EXISTS "objects_bucketId_fkey";
ALTER TABLE IF EXISTS ONLY "public"."transacciones_financieras" DROP CONSTRAINT IF EXISTS "transacciones_financieras_moneda_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."transacciones_financieras" DROP CONSTRAINT IF EXISTS "transacciones_financieras_cita_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."seguimientos" DROP CONSTRAINT IF EXISTS "seguimientos_procedimiento_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."seguimientos" DROP CONSTRAINT IF EXISTS "seguimientos_paciente_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."seguimientos" DROP CONSTRAINT IF EXISTS "seguimientos_odontologo_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."seguimientos" DROP CONSTRAINT IF EXISTS "seguimientos_cita_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."seguimientos" DROP CONSTRAINT IF EXISTS "seguimientos_caso_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."seguimiento_imagenes" DROP CONSTRAINT IF EXISTS "seguimiento_imagenes_seguimiento_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."seguimiento_imagenes" DROP CONSTRAINT IF EXISTS "seguimiento_imagenes_caso_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."recetas" DROP CONSTRAINT IF EXISTS "recetas_prescriptor_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."recetas" DROP CONSTRAINT IF EXISTS "recetas_paciente_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."recetas" DROP CONSTRAINT IF EXISTS "recetas_cita_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."recetas" DROP CONSTRAINT IF EXISTS "recetas_caso_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."procedimientos" DROP CONSTRAINT IF EXISTS "procedimientos_unidad_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."procedimientos" DROP CONSTRAINT IF EXISTS "procedimientos_grupo_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."procedimiento_precios" DROP CONSTRAINT IF EXISTS "procedimiento_precios_procedimiento_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."procedimiento_precios" DROP CONSTRAINT IF EXISTS "procedimiento_precios_moneda_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."presupuestos" DROP CONSTRAINT IF EXISTS "presupuestos_paciente_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."presupuestos" DROP CONSTRAINT IF EXISTS "presupuestos_medico_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."presupuestos" DROP CONSTRAINT IF EXISTS "presupuestos_caso_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."presupuesto_items" DROP CONSTRAINT IF EXISTS "presupuesto_items_procedimiento_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."presupuesto_items" DROP CONSTRAINT IF EXISTS "presupuesto_items_presupuesto_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."planes_procedimiento" DROP CONSTRAINT IF EXISTS "planes_procedimiento_paciente_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."planes_procedimiento" DROP CONSTRAINT IF EXISTS "planes_procedimiento_moneda_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."planes_procedimiento" DROP CONSTRAINT IF EXISTS "planes_procedimiento_caso_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."plan_items" DROP CONSTRAINT IF EXISTS "plan_items_procedimiento_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."plan_items" DROP CONSTRAINT IF EXISTS "plan_items_plan_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."plan_items" DROP CONSTRAINT IF EXISTS "plan_items_moneda_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."personal" DROP CONSTRAINT IF EXISTS "personal_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."pagos" DROP CONSTRAINT IF EXISTS "pagos_recibido_por_fkey";
ALTER TABLE IF EXISTS ONLY "public"."pagos" DROP CONSTRAINT IF EXISTS "pagos_presupuesto_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."pagos" DROP CONSTRAINT IF EXISTS "pagos_paciente_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."pagos" DROP CONSTRAINT IF EXISTS "pagos_moneda_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."odontogramas" DROP CONSTRAINT IF EXISTS "odontogramas_paciente_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."imagenes_pacientes" DROP CONSTRAINT IF EXISTS "imagenes_pacientes_caso_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."historias_clinicas" DROP CONSTRAINT IF EXISTS "historias_clinicas_paciente_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."grupos_procedimiento" DROP CONSTRAINT IF EXISTS "grupos_procedimiento_unidad_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."imagenes_pacientes" DROP CONSTRAINT IF EXISTS "fk_paciente";
ALTER TABLE IF EXISTS ONLY "public"."presupuestos" DROP CONSTRAINT IF EXISTS "fk_moneda";
ALTER TABLE IF EXISTS ONLY "public"."diagnosticos" DROP CONSTRAINT IF EXISTS "diagnosticos_odontologo_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."diagnosticos" DROP CONSTRAINT IF EXISTS "diagnosticos_cie10_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."diagnosticos" DROP CONSTRAINT IF EXISTS "diagnosticos_caso_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."cuestionario_respuestas" DROP CONSTRAINT IF EXISTS "cuestionario_respuestas_historia_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."consentimientos" DROP CONSTRAINT IF EXISTS "consentimientos_paciente_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."consentimientos" DROP CONSTRAINT IF EXISTS "consentimientos_firmado_por_fkey";
ALTER TABLE IF EXISTS ONLY "public"."consentimientos" DROP CONSTRAINT IF EXISTS "consentimientos_caso_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."codigos_invitacion" DROP CONSTRAINT IF EXISTS "codigos_invitacion_usado_por_fkey";
ALTER TABLE IF EXISTS ONLY "public"."codigos_invitacion" DROP CONSTRAINT IF EXISTS "codigos_invitacion_creado_por_fkey";
ALTER TABLE IF EXISTS ONLY "public"."cms_servicio_imagenes" DROP CONSTRAINT IF EXISTS "cms_servicio_imagenes_servicio_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."cms_secciones" DROP CONSTRAINT IF EXISTS "cms_secciones_updated_by_fkey";
ALTER TABLE IF EXISTS ONLY "public"."citas" DROP CONSTRAINT IF EXISTS "citas_paciente_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."citas" DROP CONSTRAINT IF EXISTS "citas_odontologo_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."citas" DROP CONSTRAINT IF EXISTS "citas_moneda_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."citas" DROP CONSTRAINT IF EXISTS "citas_caso_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."casos_clinicos" DROP CONSTRAINT IF EXISTS "casos_clinicos_presupuesto_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."casos_clinicos" DROP CONSTRAINT IF EXISTS "casos_clinicos_historia_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."antecedentes" DROP CONSTRAINT IF EXISTS "antecedentes_historia_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."sso_domains" DROP CONSTRAINT IF EXISTS "sso_domains_sso_provider_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."sessions" DROP CONSTRAINT IF EXISTS "sessions_user_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."sessions" DROP CONSTRAINT IF EXISTS "sessions_oauth_client_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."saml_relay_states" DROP CONSTRAINT IF EXISTS "saml_relay_states_sso_provider_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."saml_relay_states" DROP CONSTRAINT IF EXISTS "saml_relay_states_flow_state_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."saml_providers" DROP CONSTRAINT IF EXISTS "saml_providers_sso_provider_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."refresh_tokens" DROP CONSTRAINT IF EXISTS "refresh_tokens_session_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."one_time_tokens" DROP CONSTRAINT IF EXISTS "one_time_tokens_user_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_consents" DROP CONSTRAINT IF EXISTS "oauth_consents_user_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_consents" DROP CONSTRAINT IF EXISTS "oauth_consents_client_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_authorizations" DROP CONSTRAINT IF EXISTS "oauth_authorizations_user_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_authorizations" DROP CONSTRAINT IF EXISTS "oauth_authorizations_client_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_factors" DROP CONSTRAINT IF EXISTS "mfa_factors_user_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_challenges" DROP CONSTRAINT IF EXISTS "mfa_challenges_auth_factor_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_amr_claims" DROP CONSTRAINT IF EXISTS "mfa_amr_claims_session_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."identities" DROP CONSTRAINT IF EXISTS "identities_user_id_fkey";
DROP TRIGGER IF EXISTS "update_objects_updated_at" ON "storage"."objects";
DROP TRIGGER IF EXISTS "prefixes_delete_hierarchy" ON "storage"."prefixes";
DROP TRIGGER IF EXISTS "prefixes_create_hierarchy" ON "storage"."prefixes";
DROP TRIGGER IF EXISTS "objects_update_create_prefix" ON "storage"."objects";
DROP TRIGGER IF EXISTS "objects_insert_create_prefix" ON "storage"."objects";
DROP TRIGGER IF EXISTS "objects_delete_delete_prefix" ON "storage"."objects";
DROP TRIGGER IF EXISTS "enforce_bucket_name_length_trigger" ON "storage"."buckets";
DROP TRIGGER IF EXISTS "update_cms_servicios_updated_at" ON "public"."cms_servicios";
DROP TRIGGER IF EXISTS "update_cms_secciones_updated_at" ON "public"."cms_secciones";
DROP TRIGGER IF EXISTS "update_chatbot_faqs_updated_at" ON "public"."chatbot_faqs";
DROP TRIGGER IF EXISTS "trigger_servicio_imagenes_updated_at" ON "public"."cms_servicio_imagenes";
DROP TRIGGER IF EXISTS "trigger_generar_numero_historia" ON "public"."pacientes";
DROP TRIGGER IF EXISTS "trigger_actualizar_updated_at" ON "public"."ajustes_aplicacion";
DROP TRIGGER IF EXISTS "trigger_actualizar_total_pagado" ON "public"."pagos";
DROP TRIGGER IF EXISTS "trigger_actualizar_costo_plan" ON "public"."plan_items";
DROP TRIGGER IF EXISTS "trigger_actualizar_costo_cita" ON "public"."transacciones_financieras";
DROP TRIGGER IF EXISTS "set_timestamp_historias_clinicas" ON "public"."historias_clinicas";
DROP INDEX IF EXISTS "storage"."vector_indexes_name_bucket_id_idx";
DROP INDEX IF EXISTS "storage"."objects_bucket_id_level_idx";
DROP INDEX IF EXISTS "storage"."name_prefix_search";
DROP INDEX IF EXISTS "storage"."idx_prefixes_lower_name";
DROP INDEX IF EXISTS "storage"."idx_objects_lower_name";
DROP INDEX IF EXISTS "storage"."idx_objects_bucket_id_name";
DROP INDEX IF EXISTS "storage"."idx_name_bucket_level_unique";
DROP INDEX IF EXISTS "storage"."idx_multipart_uploads_list";
DROP INDEX IF EXISTS "storage"."buckets_analytics_unique_name_idx";
DROP INDEX IF EXISTS "storage"."bucketid_objname";
DROP INDEX IF EXISTS "storage"."bname";
DROP INDEX IF EXISTS "public"."idx_servicio_imagenes_servicio_id";
DROP INDEX IF EXISTS "public"."idx_servicio_imagenes_orden";
DROP INDEX IF EXISTS "public"."idx_seguimientos_caso_id";
DROP INDEX IF EXISTS "public"."idx_seguimiento_imagenes_caso_id";
DROP INDEX IF EXISTS "public"."idx_recetas_caso_id";
DROP INDEX IF EXISTS "public"."idx_pagos_presupuesto_id";
DROP INDEX IF EXISTS "public"."idx_pagos_paciente_id";
DROP INDEX IF EXISTS "public"."idx_pagos_fecha";
DROP INDEX IF EXISTS "public"."idx_pacientes_numero_historia_unique";
DROP INDEX IF EXISTS "public"."idx_imagenes_pacientes_etapa";
DROP INDEX IF EXISTS "public"."idx_imagenes_pacientes_caso_id";
DROP INDEX IF EXISTS "public"."idx_historias_clinicas_paciente_id";
DROP INDEX IF EXISTS "public"."idx_diagnosticos_caso_id";
DROP INDEX IF EXISTS "public"."idx_cuestionario_respuestas_historia_id";
DROP INDEX IF EXISTS "public"."idx_consentimientos_caso_id";
DROP INDEX IF EXISTS "public"."idx_citas_caso_id";
DROP INDEX IF EXISTS "public"."idx_chatbot_conv_expires";
DROP INDEX IF EXISTS "public"."idx_casos_historia_id";
DROP INDEX IF EXISTS "public"."idx_ajustes_aplicacion_grupo";
DROP INDEX IF EXISTS "public"."idx_ajustes_aplicacion_clave";
DROP INDEX IF EXISTS "public"."chatbot_faqs_embedding_idx";
DROP INDEX IF EXISTS "public"."chatbot_contexto_embedding_idx";
DROP INDEX IF EXISTS "auth"."users_is_anonymous_idx";
DROP INDEX IF EXISTS "auth"."users_instance_id_idx";
DROP INDEX IF EXISTS "auth"."users_instance_id_email_idx";
DROP INDEX IF EXISTS "auth"."users_email_partial_key";
DROP INDEX IF EXISTS "auth"."user_id_created_at_idx";
DROP INDEX IF EXISTS "auth"."unique_phone_factor_per_user";
DROP INDEX IF EXISTS "auth"."sso_providers_resource_id_pattern_idx";
DROP INDEX IF EXISTS "auth"."sso_providers_resource_id_idx";
DROP INDEX IF EXISTS "auth"."sso_domains_sso_provider_id_idx";
DROP INDEX IF EXISTS "auth"."sso_domains_domain_idx";
DROP INDEX IF EXISTS "auth"."sessions_user_id_idx";
DROP INDEX IF EXISTS "auth"."sessions_oauth_client_id_idx";
DROP INDEX IF EXISTS "auth"."sessions_not_after_idx";
DROP INDEX IF EXISTS "auth"."saml_relay_states_sso_provider_id_idx";
DROP INDEX IF EXISTS "auth"."saml_relay_states_for_email_idx";
DROP INDEX IF EXISTS "auth"."saml_relay_states_created_at_idx";
DROP INDEX IF EXISTS "auth"."saml_providers_sso_provider_id_idx";
DROP INDEX IF EXISTS "auth"."refresh_tokens_updated_at_idx";
DROP INDEX IF EXISTS "auth"."refresh_tokens_session_id_revoked_idx";
DROP INDEX IF EXISTS "auth"."refresh_tokens_parent_idx";
DROP INDEX IF EXISTS "auth"."refresh_tokens_instance_id_user_id_idx";
DROP INDEX IF EXISTS "auth"."refresh_tokens_instance_id_idx";
DROP INDEX IF EXISTS "auth"."recovery_token_idx";
DROP INDEX IF EXISTS "auth"."reauthentication_token_idx";
DROP INDEX IF EXISTS "auth"."one_time_tokens_user_id_token_type_key";
DROP INDEX IF EXISTS "auth"."one_time_tokens_token_hash_hash_idx";
DROP INDEX IF EXISTS "auth"."one_time_tokens_relates_to_hash_idx";
DROP INDEX IF EXISTS "auth"."oauth_consents_user_order_idx";
DROP INDEX IF EXISTS "auth"."oauth_consents_active_user_client_idx";
DROP INDEX IF EXISTS "auth"."oauth_consents_active_client_idx";
DROP INDEX IF EXISTS "auth"."oauth_clients_deleted_at_idx";
DROP INDEX IF EXISTS "auth"."oauth_auth_pending_exp_idx";
DROP INDEX IF EXISTS "auth"."mfa_factors_user_id_idx";
DROP INDEX IF EXISTS "auth"."mfa_factors_user_friendly_name_unique";
DROP INDEX IF EXISTS "auth"."mfa_challenge_created_at_idx";
DROP INDEX IF EXISTS "auth"."idx_user_id_auth_method";
DROP INDEX IF EXISTS "auth"."idx_auth_code";
DROP INDEX IF EXISTS "auth"."identities_user_id_idx";
DROP INDEX IF EXISTS "auth"."identities_email_idx";
DROP INDEX IF EXISTS "auth"."flow_state_created_at_idx";
DROP INDEX IF EXISTS "auth"."factor_id_created_at_idx";
DROP INDEX IF EXISTS "auth"."email_change_token_new_idx";
DROP INDEX IF EXISTS "auth"."email_change_token_current_idx";
DROP INDEX IF EXISTS "auth"."confirmation_token_idx";
DROP INDEX IF EXISTS "auth"."audit_logs_instance_id_idx";
ALTER TABLE IF EXISTS ONLY "storage"."vector_indexes" DROP CONSTRAINT IF EXISTS "vector_indexes_pkey";
ALTER TABLE IF EXISTS ONLY "storage"."s3_multipart_uploads" DROP CONSTRAINT IF EXISTS "s3_multipart_uploads_pkey";
ALTER TABLE IF EXISTS ONLY "storage"."s3_multipart_uploads_parts" DROP CONSTRAINT IF EXISTS "s3_multipart_uploads_parts_pkey";
ALTER TABLE IF EXISTS ONLY "storage"."prefixes" DROP CONSTRAINT IF EXISTS "prefixes_pkey";
ALTER TABLE IF EXISTS ONLY "storage"."objects" DROP CONSTRAINT IF EXISTS "objects_pkey";
ALTER TABLE IF EXISTS ONLY "storage"."migrations" DROP CONSTRAINT IF EXISTS "migrations_pkey";
ALTER TABLE IF EXISTS ONLY "storage"."migrations" DROP CONSTRAINT IF EXISTS "migrations_name_key";
ALTER TABLE IF EXISTS ONLY "storage"."buckets_vectors" DROP CONSTRAINT IF EXISTS "buckets_vectors_pkey";
ALTER TABLE IF EXISTS ONLY "storage"."buckets" DROP CONSTRAINT IF EXISTS "buckets_pkey";
ALTER TABLE IF EXISTS ONLY "storage"."buckets_analytics" DROP CONSTRAINT IF EXISTS "buckets_analytics_pkey";
ALTER TABLE IF EXISTS ONLY "public"."antecedentes" DROP CONSTRAINT IF EXISTS "unique_historia_categoria";
ALTER TABLE IF EXISTS ONLY "public"."unidades" DROP CONSTRAINT IF EXISTS "unidades_pkey";
ALTER TABLE IF EXISTS ONLY "public"."unidades" DROP CONSTRAINT IF EXISTS "unidades_nombre_key";
ALTER TABLE IF EXISTS ONLY "public"."transacciones_financieras" DROP CONSTRAINT IF EXISTS "transacciones_financieras_pkey";
ALTER TABLE IF EXISTS ONLY "public"."seguimientos" DROP CONSTRAINT IF EXISTS "seguimientos_pkey";
ALTER TABLE IF EXISTS ONLY "public"."seguimiento_imagenes" DROP CONSTRAINT IF EXISTS "seguimiento_imagenes_pkey";
ALTER TABLE IF EXISTS ONLY "public"."recetas" DROP CONSTRAINT IF EXISTS "recetas_pkey";
ALTER TABLE IF EXISTS ONLY "public"."procedimientos" DROP CONSTRAINT IF EXISTS "procedimientos_pkey";
ALTER TABLE IF EXISTS ONLY "public"."procedimientos" DROP CONSTRAINT IF EXISTS "procedimientos_nombre_key";
ALTER TABLE IF EXISTS ONLY "public"."procedimiento_precios" DROP CONSTRAINT IF EXISTS "procedimiento_precios_pkey";
ALTER TABLE IF EXISTS ONLY "public"."procedimiento_precios" DROP CONSTRAINT IF EXISTS "procedimiento_moneda_unique";
ALTER TABLE IF EXISTS ONLY "public"."presupuestos" DROP CONSTRAINT IF EXISTS "presupuestos_pkey";
ALTER TABLE IF EXISTS ONLY "public"."presupuesto_items" DROP CONSTRAINT IF EXISTS "presupuesto_items_pkey";
ALTER TABLE IF EXISTS ONLY "public"."planes_procedimiento" DROP CONSTRAINT IF EXISTS "planes_procedimiento_pkey";
ALTER TABLE IF EXISTS ONLY "public"."plan_items" DROP CONSTRAINT IF EXISTS "plan_items_pkey";
ALTER TABLE IF EXISTS ONLY "public"."personal" DROP CONSTRAINT IF EXISTS "personal_pkey";
ALTER TABLE IF EXISTS ONLY "public"."personal" DROP CONSTRAINT IF EXISTS "personal_email_key";
ALTER TABLE IF EXISTS ONLY "public"."pagos" DROP CONSTRAINT IF EXISTS "pagos_pkey";
ALTER TABLE IF EXISTS ONLY "public"."pacientes" DROP CONSTRAINT IF EXISTS "pacientes_pkey";
ALTER TABLE IF EXISTS ONLY "public"."pacientes" DROP CONSTRAINT IF EXISTS "pacientes_email_key";
ALTER TABLE IF EXISTS ONLY "public"."pacientes" DROP CONSTRAINT IF EXISTS "pacientes_dni_key";
ALTER TABLE IF EXISTS ONLY "public"."odontogramas" DROP CONSTRAINT IF EXISTS "odontogramas_pkey";
ALTER TABLE IF EXISTS ONLY "public"."odontogramas" DROP CONSTRAINT IF EXISTS "odontograma_paciente_version_unique";
ALTER TABLE IF EXISTS ONLY "public"."pacientes" DROP CONSTRAINT IF EXISTS "numero_historia_unique";
ALTER TABLE IF EXISTS ONLY "public"."numero_historia_secuencia" DROP CONSTRAINT IF EXISTS "numero_historia_secuencia_pkey";
ALTER TABLE IF EXISTS ONLY "public"."monedas" DROP CONSTRAINT IF EXISTS "monedas_pkey";
ALTER TABLE IF EXISTS ONLY "public"."monedas" DROP CONSTRAINT IF EXISTS "monedas_codigo_key";
ALTER TABLE IF EXISTS ONLY "public"."imagenes_pacientes" DROP CONSTRAINT IF EXISTS "imagenes_pacientes_pkey";
ALTER TABLE IF EXISTS ONLY "public"."historias_clinicas" DROP CONSTRAINT IF EXISTS "historias_clinicas_pkey";
ALTER TABLE IF EXISTS ONLY "public"."historias_clinicas" DROP CONSTRAINT IF EXISTS "historias_clinicas_paciente_id_key";
ALTER TABLE IF EXISTS ONLY "public"."grupos_procedimiento" DROP CONSTRAINT IF EXISTS "grupos_procedimiento_pkey";
ALTER TABLE IF EXISTS ONLY "public"."grupos_procedimiento" DROP CONSTRAINT IF EXISTS "grupos_procedimiento_nombre_key";
ALTER TABLE IF EXISTS ONLY "public"."diagnosticos" DROP CONSTRAINT IF EXISTS "diagnosticos_pkey";
ALTER TABLE IF EXISTS ONLY "public"."cuestionario_respuestas" DROP CONSTRAINT IF EXISTS "cuestionario_respuestas_pkey";
ALTER TABLE IF EXISTS ONLY "public"."cuestionario_respuestas" DROP CONSTRAINT IF EXISTS "cuestionario_respuestas_historia_id_seccion_pregunta_key";
ALTER TABLE IF EXISTS ONLY "public"."consentimientos" DROP CONSTRAINT IF EXISTS "consentimientos_pkey";
ALTER TABLE IF EXISTS ONLY "public"."config_seguridad" DROP CONSTRAINT IF EXISTS "config_seguridad_pkey";
ALTER TABLE IF EXISTS ONLY "public"."config_seguridad" DROP CONSTRAINT IF EXISTS "config_seguridad_clave_key";
ALTER TABLE IF EXISTS ONLY "public"."codigos_invitacion" DROP CONSTRAINT IF EXISTS "codigos_invitacion_pkey";
ALTER TABLE IF EXISTS ONLY "public"."codigos_invitacion" DROP CONSTRAINT IF EXISTS "codigos_invitacion_codigo_key";
ALTER TABLE IF EXISTS ONLY "public"."cms_tema" DROP CONSTRAINT IF EXISTS "cms_tema_pkey";
ALTER TABLE IF EXISTS ONLY "public"."cms_tema" DROP CONSTRAINT IF EXISTS "cms_tema_clave_key";
ALTER TABLE IF EXISTS ONLY "public"."cms_servicios" DROP CONSTRAINT IF EXISTS "cms_servicios_pkey";
ALTER TABLE IF EXISTS ONLY "public"."cms_servicio_imagenes" DROP CONSTRAINT IF EXISTS "cms_servicio_imagenes_pkey";
ALTER TABLE IF EXISTS ONLY "public"."cms_secciones" DROP CONSTRAINT IF EXISTS "cms_secciones_seccion_key";
ALTER TABLE IF EXISTS ONLY "public"."cms_secciones" DROP CONSTRAINT IF EXISTS "cms_secciones_pkey";
ALTER TABLE IF EXISTS ONLY "public"."cms_equipo" DROP CONSTRAINT IF EXISTS "cms_equipo_pkey";
ALTER TABLE IF EXISTS ONLY "public"."cms_carrusel" DROP CONSTRAINT IF EXISTS "cms_carrusel_pkey";
ALTER TABLE IF EXISTS ONLY "public"."citas" DROP CONSTRAINT IF EXISTS "citas_pkey";
ALTER TABLE IF EXISTS ONLY "public"."cie10_catalogo" DROP CONSTRAINT IF EXISTS "cie10_catalogo_pkey";
ALTER TABLE IF EXISTS ONLY "public"."cie10_catalogo" DROP CONSTRAINT IF EXISTS "cie10_catalogo_codigo_key";
ALTER TABLE IF EXISTS ONLY "public"."chatbot_rate_limit" DROP CONSTRAINT IF EXISTS "chatbot_rate_limit_pkey";
ALTER TABLE IF EXISTS ONLY "public"."chatbot_rate_limit" DROP CONSTRAINT IF EXISTS "chatbot_rate_limit_ip_hash_key";
ALTER TABLE IF EXISTS ONLY "public"."chatbot_faqs" DROP CONSTRAINT IF EXISTS "chatbot_faqs_pkey";
ALTER TABLE IF EXISTS ONLY "public"."chatbot_conversaciones" DROP CONSTRAINT IF EXISTS "chatbot_conversaciones_pkey";
ALTER TABLE IF EXISTS ONLY "public"."chatbot_contexto" DROP CONSTRAINT IF EXISTS "chatbot_contexto_pkey";
ALTER TABLE IF EXISTS ONLY "public"."chatbot_cola" DROP CONSTRAINT IF EXISTS "chatbot_cola_pkey";
ALTER TABLE IF EXISTS ONLY "public"."casos_clinicos" DROP CONSTRAINT IF EXISTS "casos_clinicos_pkey";
ALTER TABLE IF EXISTS ONLY "public"."antecedentes" DROP CONSTRAINT IF EXISTS "antecedentes_pkey";
ALTER TABLE IF EXISTS ONLY "public"."antecedentes" DROP CONSTRAINT IF EXISTS "antecedentes_historia_id_categoria_key";
ALTER TABLE IF EXISTS ONLY "public"."ajustes_aplicacion" DROP CONSTRAINT IF EXISTS "ajustes_aplicacion_pkey";
ALTER TABLE IF EXISTS ONLY "public"."ajustes_aplicacion" DROP CONSTRAINT IF EXISTS "ajustes_aplicacion_clave_key";
ALTER TABLE IF EXISTS ONLY "auth"."users" DROP CONSTRAINT IF EXISTS "users_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."users" DROP CONSTRAINT IF EXISTS "users_phone_key";
ALTER TABLE IF EXISTS ONLY "auth"."sso_providers" DROP CONSTRAINT IF EXISTS "sso_providers_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."sso_domains" DROP CONSTRAINT IF EXISTS "sso_domains_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."sessions" DROP CONSTRAINT IF EXISTS "sessions_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."schema_migrations" DROP CONSTRAINT IF EXISTS "schema_migrations_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."saml_relay_states" DROP CONSTRAINT IF EXISTS "saml_relay_states_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."saml_providers" DROP CONSTRAINT IF EXISTS "saml_providers_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."saml_providers" DROP CONSTRAINT IF EXISTS "saml_providers_entity_id_key";
ALTER TABLE IF EXISTS ONLY "auth"."refresh_tokens" DROP CONSTRAINT IF EXISTS "refresh_tokens_token_unique";
ALTER TABLE IF EXISTS ONLY "auth"."refresh_tokens" DROP CONSTRAINT IF EXISTS "refresh_tokens_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."one_time_tokens" DROP CONSTRAINT IF EXISTS "one_time_tokens_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_consents" DROP CONSTRAINT IF EXISTS "oauth_consents_user_client_unique";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_consents" DROP CONSTRAINT IF EXISTS "oauth_consents_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_clients" DROP CONSTRAINT IF EXISTS "oauth_clients_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_authorizations" DROP CONSTRAINT IF EXISTS "oauth_authorizations_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_authorizations" DROP CONSTRAINT IF EXISTS "oauth_authorizations_authorization_id_key";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_authorizations" DROP CONSTRAINT IF EXISTS "oauth_authorizations_authorization_code_key";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_factors" DROP CONSTRAINT IF EXISTS "mfa_factors_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_factors" DROP CONSTRAINT IF EXISTS "mfa_factors_last_challenged_at_key";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_challenges" DROP CONSTRAINT IF EXISTS "mfa_challenges_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_amr_claims" DROP CONSTRAINT IF EXISTS "mfa_amr_claims_session_id_authentication_method_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."instances" DROP CONSTRAINT IF EXISTS "instances_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."identities" DROP CONSTRAINT IF EXISTS "identities_provider_id_provider_unique";
ALTER TABLE IF EXISTS ONLY "auth"."identities" DROP CONSTRAINT IF EXISTS "identities_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."flow_state" DROP CONSTRAINT IF EXISTS "flow_state_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."audit_log_entries" DROP CONSTRAINT IF EXISTS "audit_log_entries_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_amr_claims" DROP CONSTRAINT IF EXISTS "amr_id_pk";
ALTER TABLE IF EXISTS "public"."cie10_catalogo" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE IF EXISTS "auth"."refresh_tokens" ALTER COLUMN "id" DROP DEFAULT;
DROP TABLE IF EXISTS "storage"."vector_indexes";
DROP TABLE IF EXISTS "storage"."s3_multipart_uploads_parts";
DROP TABLE IF EXISTS "storage"."s3_multipart_uploads";
DROP TABLE IF EXISTS "storage"."prefixes";
DROP TABLE IF EXISTS "storage"."objects";
DROP TABLE IF EXISTS "storage"."migrations";
DROP TABLE IF EXISTS "storage"."buckets_vectors";
DROP TABLE IF EXISTS "storage"."buckets_analytics";
DROP TABLE IF EXISTS "storage"."buckets";
DROP VIEW IF EXISTS "public"."vista_planes_costo";
DROP VIEW IF EXISTS "public"."vista_citas_costo";
DROP TABLE IF EXISTS "public"."unidades";
DROP TABLE IF EXISTS "public"."transacciones_financieras";
DROP TABLE IF EXISTS "public"."seguimientos";
DROP TABLE IF EXISTS "public"."seguimiento_imagenes";
DROP TABLE IF EXISTS "public"."recetas";
DROP TABLE IF EXISTS "public"."procedimientos";
DROP TABLE IF EXISTS "public"."procedimiento_precios";
DROP TABLE IF EXISTS "public"."presupuestos";
DROP TABLE IF EXISTS "public"."presupuesto_items";
DROP TABLE IF EXISTS "public"."planes_procedimiento";
DROP TABLE IF EXISTS "public"."plan_items";
DROP TABLE IF EXISTS "public"."personal";
DROP TABLE IF EXISTS "public"."pagos";
DROP TABLE IF EXISTS "public"."pacientes";
DROP TABLE IF EXISTS "public"."odontogramas";
DROP TABLE IF EXISTS "public"."numero_historia_secuencia";
DROP TABLE IF EXISTS "public"."monedas";
DROP TABLE IF EXISTS "public"."imagenes_pacientes";
DROP TABLE IF EXISTS "public"."historias_clinicas";
DROP TABLE IF EXISTS "public"."grupos_procedimiento";
DROP TABLE IF EXISTS "public"."diagnosticos";
DROP TABLE IF EXISTS "public"."cuestionario_respuestas";
DROP TABLE IF EXISTS "public"."consentimientos";
DROP TABLE IF EXISTS "public"."config_seguridad";
DROP TABLE IF EXISTS "public"."codigos_invitacion";
DROP TABLE IF EXISTS "public"."cms_tema";
DROP TABLE IF EXISTS "public"."cms_servicios";
DROP TABLE IF EXISTS "public"."cms_servicio_imagenes";
DROP TABLE IF EXISTS "public"."cms_secciones";
DROP TABLE IF EXISTS "public"."cms_equipo";
DROP TABLE IF EXISTS "public"."cms_carrusel";
DROP TABLE IF EXISTS "public"."citas";
DROP SEQUENCE IF EXISTS "public"."cie10_catalogo_id_seq";
DROP TABLE IF EXISTS "public"."cie10_catalogo";
DROP TABLE IF EXISTS "public"."chatbot_rate_limit";
DROP TABLE IF EXISTS "public"."chatbot_faqs";
DROP TABLE IF EXISTS "public"."chatbot_conversaciones";
DROP TABLE IF EXISTS "public"."chatbot_contexto";
DROP TABLE IF EXISTS "public"."chatbot_cola";
DROP TABLE IF EXISTS "public"."casos_clinicos";
DROP TABLE IF EXISTS "public"."antecedentes";
DROP TABLE IF EXISTS "public"."ajustes_aplicacion";
DROP TABLE IF EXISTS "auth"."users";
DROP TABLE IF EXISTS "auth"."sso_providers";
DROP TABLE IF EXISTS "auth"."sso_domains";
DROP TABLE IF EXISTS "auth"."sessions";
DROP TABLE IF EXISTS "auth"."schema_migrations";
DROP TABLE IF EXISTS "auth"."saml_relay_states";
DROP TABLE IF EXISTS "auth"."saml_providers";
DROP SEQUENCE IF EXISTS "auth"."refresh_tokens_id_seq";
DROP TABLE IF EXISTS "auth"."refresh_tokens";
DROP TABLE IF EXISTS "auth"."one_time_tokens";
DROP TABLE IF EXISTS "auth"."oauth_consents";
DROP TABLE IF EXISTS "auth"."oauth_clients";
DROP TABLE IF EXISTS "auth"."oauth_authorizations";
DROP TABLE IF EXISTS "auth"."mfa_factors";
DROP TABLE IF EXISTS "auth"."mfa_challenges";
DROP TABLE IF EXISTS "auth"."mfa_amr_claims";
DROP TABLE IF EXISTS "auth"."instances";
DROP TABLE IF EXISTS "auth"."identities";
DROP TABLE IF EXISTS "auth"."flow_state";
DROP TABLE IF EXISTS "auth"."audit_log_entries";
DROP FUNCTION IF EXISTS "storage"."update_updated_at_column"();
DROP FUNCTION IF EXISTS "storage"."search_v2"("prefix" "text", "bucket_name" "text", "limits" integer, "levels" integer, "start_after" "text", "sort_order" "text", "sort_column" "text", "sort_column_after" "text");
DROP FUNCTION IF EXISTS "storage"."search_v1_optimised"("prefix" "text", "bucketname" "text", "limits" integer, "levels" integer, "offsets" integer, "search" "text", "sortcolumn" "text", "sortorder" "text");
DROP FUNCTION IF EXISTS "storage"."search_legacy_v1"("prefix" "text", "bucketname" "text", "limits" integer, "levels" integer, "offsets" integer, "search" "text", "sortcolumn" "text", "sortorder" "text");
DROP FUNCTION IF EXISTS "storage"."search"("prefix" "text", "bucketname" "text", "limits" integer, "levels" integer, "offsets" integer, "search" "text", "sortcolumn" "text", "sortorder" "text");
DROP FUNCTION IF EXISTS "storage"."prefixes_insert_trigger"();
DROP FUNCTION IF EXISTS "storage"."prefixes_delete_cleanup"();
DROP FUNCTION IF EXISTS "storage"."operation"();
DROP FUNCTION IF EXISTS "storage"."objects_update_prefix_trigger"();
DROP FUNCTION IF EXISTS "storage"."objects_update_level_trigger"();
DROP FUNCTION IF EXISTS "storage"."objects_update_cleanup"();
DROP FUNCTION IF EXISTS "storage"."objects_insert_prefix_trigger"();
DROP FUNCTION IF EXISTS "storage"."objects_delete_cleanup"();
DROP FUNCTION IF EXISTS "storage"."lock_top_prefixes"("bucket_ids" "text"[], "names" "text"[]);
DROP FUNCTION IF EXISTS "storage"."list_objects_with_delimiter"("bucket_id" "text", "prefix_param" "text", "delimiter_param" "text", "max_keys" integer, "start_after" "text", "next_token" "text");
DROP FUNCTION IF EXISTS "storage"."list_multipart_uploads_with_delimiter"("bucket_id" "text", "prefix_param" "text", "delimiter_param" "text", "max_keys" integer, "next_key_token" "text", "next_upload_token" "text");
DROP FUNCTION IF EXISTS "storage"."get_size_by_bucket"();
DROP FUNCTION IF EXISTS "storage"."get_prefixes"("name" "text");
DROP FUNCTION IF EXISTS "storage"."get_prefix"("name" "text");
DROP FUNCTION IF EXISTS "storage"."get_level"("name" "text");
DROP FUNCTION IF EXISTS "storage"."foldername"("name" "text");
DROP FUNCTION IF EXISTS "storage"."filename"("name" "text");
DROP FUNCTION IF EXISTS "storage"."extension"("name" "text");
DROP FUNCTION IF EXISTS "storage"."enforce_bucket_name_length"();
DROP FUNCTION IF EXISTS "storage"."delete_prefix_hierarchy_trigger"();
DROP FUNCTION IF EXISTS "storage"."delete_prefix"("_bucket_id" "text", "_name" "text");
DROP FUNCTION IF EXISTS "storage"."delete_leaf_prefixes"("bucket_ids" "text"[], "names" "text"[]);
DROP FUNCTION IF EXISTS "storage"."can_insert_object"("bucketid" "text", "name" "text", "owner" "uuid", "metadata" "jsonb");
DROP FUNCTION IF EXISTS "storage"."add_prefixes"("_bucket_id" "text", "_name" "text");
DROP FUNCTION IF EXISTS "public"."verificar_rate_limit"("p_ip_hash" "text", "p_limite" integer, "p_ventana_minutos" integer);
DROP FUNCTION IF EXISTS "public"."update_updated_at_column"();
DROP FUNCTION IF EXISTS "public"."update_servicio_imagenes_updated_at"();
DROP FUNCTION IF EXISTS "public"."trigger_set_timestamp"();
DROP FUNCTION IF EXISTS "public"."sync_personal_to_auth"();
DROP FUNCTION IF EXISTS "public"."search_faqs_by_embedding"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer);
DROP FUNCTION IF EXISTS "public"."search_contexto_by_embedding"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer);
DROP FUNCTION IF EXISTS "public"."obtener_ajustes_por_grupo"("p_grupo" "text");
DROP FUNCTION IF EXISTS "public"."obtener_ajuste"("p_clave" "text");
DROP FUNCTION IF EXISTS "public"."limpiar_conversaciones_expiradas"();
DROP FUNCTION IF EXISTS "public"."generar_numero_historia"();
DROP FUNCTION IF EXISTS "public"."create_personal_with_auth"("p_email" "text", "p_password" "text", "p_nombre" "text", "p_rol" "text", "p_especialidad" "text", "p_telefono" "text");
DROP FUNCTION IF EXISTS "public"."change_personal_password"("p_id" "uuid", "p_password" "text");
DROP FUNCTION IF EXISTS "public"."calcular_costo_plan"("plan_id" "uuid");
DROP FUNCTION IF EXISTS "public"."auth_admin_update_user"("uid" "uuid", "attrs" "jsonb");
DROP FUNCTION IF EXISTS "public"."actualizar_updated_at"();
DROP FUNCTION IF EXISTS "public"."actualizar_total_pagado"();
DROP FUNCTION IF EXISTS "public"."actualizar_costo_plan"();
DROP FUNCTION IF EXISTS "public"."actualizar_costo_cita"();
DROP FUNCTION IF EXISTS "auth"."uid"();
DROP FUNCTION IF EXISTS "auth"."role"();
DROP FUNCTION IF EXISTS "auth"."jwt"();
DROP FUNCTION IF EXISTS "auth"."email"();
DROP TYPE IF EXISTS "storage"."buckettype";
DROP TYPE IF EXISTS "public"."tipo_ajuste";
DROP TYPE IF EXISTS "public"."rol";
DROP TYPE IF EXISTS "public"."plan_status";
DROP TYPE IF EXISTS "public"."medida_tratamiento";
DROP TYPE IF EXISTS "public"."item_status";
DROP TYPE IF EXISTS "public"."estado_civil";
DROP TYPE IF EXISTS "public"."estado_cita";
DROP TYPE IF EXISTS "auth"."one_time_token_type";
DROP TYPE IF EXISTS "auth"."oauth_response_type";
DROP TYPE IF EXISTS "auth"."oauth_registration_type";
DROP TYPE IF EXISTS "auth"."oauth_client_type";
DROP TYPE IF EXISTS "auth"."oauth_authorization_status";
DROP TYPE IF EXISTS "auth"."factor_type";
DROP TYPE IF EXISTS "auth"."factor_status";
DROP TYPE IF EXISTS "auth"."code_challenge_method";
DROP TYPE IF EXISTS "auth"."aal_level";
DROP SCHEMA IF EXISTS "storage";
DROP SCHEMA IF EXISTS "public";
DROP SCHEMA IF EXISTS "auth";
--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "auth";


--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "public";


--
-- Name: SCHEMA "public"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA "public" IS 'standard public schema';


--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "storage";


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."aal_level" AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."code_challenge_method" AS ENUM (
    's256',
    'plain'
);


--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."factor_status" AS ENUM (
    'unverified',
    'verified'
);


--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."factor_type" AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


--
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."oauth_authorization_status" AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


--
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."oauth_client_type" AS ENUM (
    'public',
    'confidential'
);


--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."oauth_registration_type" AS ENUM (
    'dynamic',
    'manual'
);


--
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."oauth_response_type" AS ENUM (
    'code'
);


--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."one_time_token_type" AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


--
-- Name: estado_cita; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE "public"."estado_cita" AS ENUM (
    'Programada',
    'Confirmada',
    'Cancelada',
    'Completada',
    'No Asistió'
);


--
-- Name: estado_civil; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE "public"."estado_civil" AS ENUM (
    'Soltero',
    'Casado',
    'Divorciado',
    'Viudo',
    'Unión Libre'
);


--
-- Name: item_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE "public"."item_status" AS ENUM (
    'Pendiente',
    'En Progreso',
    'Completado',
    'Cancelado'
);


--
-- Name: medida_tratamiento; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE "public"."medida_tratamiento" AS ENUM (
    'No específica',
    'General',
    'Pieza',
    'Radiografía',
    'Prótesis',
    'Corona',
    'Consulta',
    'Cirugías'
);


--
-- Name: plan_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE "public"."plan_status" AS ENUM (
    'Propuesto',
    'En Progreso',
    'Completado',
    'Cancelado'
);


--
-- Name: rol; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE "public"."rol" AS ENUM (
    'Admin',
    'Odontólogo'
);


--
-- Name: tipo_ajuste; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE "public"."tipo_ajuste" AS ENUM (
    'color',
    'texto',
    'textarea',
    'numero',
    'booleano',
    'imagen',
    'email',
    'telefono',
    'url'
);


--
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: -
--

CREATE TYPE "storage"."buckettype" AS ENUM (
    'STANDARD',
    'ANALYTICS',
    'VECTOR'
);


--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION "auth"."email"() RETURNS "text"
    LANGUAGE "sql" STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


--
-- Name: FUNCTION "email"(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION "auth"."email"() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION "auth"."jwt"() RETURNS "jsonb"
    LANGUAGE "sql" STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION "auth"."role"() RETURNS "text"
    LANGUAGE "sql" STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


--
-- Name: FUNCTION "role"(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION "auth"."role"() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION "auth"."uid"() RETURNS "uuid"
    LANGUAGE "sql" STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


--
-- Name: FUNCTION "uid"(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION "auth"."uid"() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: actualizar_costo_cita(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION "public"."actualizar_costo_cita"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Actualizar el costo de la cita afectada
  UPDATE citas 
  SET costo_total = calcular_costo_cita(
    CASE 
      WHEN TG_OP = 'DELETE' THEN OLD.cita_id
      ELSE NEW.cita_id
    END
  )
  WHERE id = (
    CASE 
      WHEN TG_OP = 'DELETE' THEN OLD.cita_id
      ELSE NEW.cita_id
    END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;


--
-- Name: actualizar_costo_plan(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION "public"."actualizar_costo_plan"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Actualizar el costo del plan afectado
  UPDATE planes_procedimiento 
  SET costo_total = calcular_costo_plan(
    CASE 
      WHEN TG_OP = 'DELETE' THEN OLD.plan_id
      ELSE NEW.plan_id
    END
  )
  WHERE id = (
    CASE 
      WHEN TG_OP = 'DELETE' THEN OLD.plan_id
      ELSE NEW.plan_id
    END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;


--
-- Name: actualizar_total_pagado(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION "public"."actualizar_total_pagado"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE presupuestos 
    SET total_pagado = COALESCE(total_pagado, 0) + NEW.monto
    WHERE id = NEW.presupuesto_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE presupuestos 
    SET total_pagado = COALESCE(total_pagado, 0) - OLD.monto
    WHERE id = OLD.presupuesto_id;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE presupuestos 
    SET total_pagado = COALESCE(total_pagado, 0) - OLD.monto + NEW.monto
    WHERE id = NEW.presupuesto_id;
  END IF;
  RETURN NULL;
END;
$$;


--
-- Name: actualizar_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION "public"."actualizar_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


--
-- Name: auth_admin_update_user("uuid", "jsonb"); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION "public"."auth_admin_update_user"("uid" "uuid", "attrs" "jsonb") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    resp jsonb;
BEGIN
    SELECT
        content::jsonb
    INTO resp
    FROM
        http(
            'PATCH',
            auth.jwt(),
            'http://localhost:8000/auth/v1/admin/users/' || uid::text,
            attrs
        );

    RETURN resp;
END;
$$;


--
-- Name: calcular_costo_plan("uuid"); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION "public"."calcular_costo_plan"("plan_id" "uuid") RETURNS numeric
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  costo_total DECIMAL(10,2) := 0;
  plan_moneda UUID;
BEGIN
  -- Obtener la moneda del plan
  SELECT moneda_id INTO plan_moneda 
  FROM planes_procedimiento 
  WHERE id = plan_id;
  
  -- Si no hay moneda definida en el plan, usar la primera moneda de los items
  IF plan_moneda IS NULL THEN
    SELECT DISTINCT moneda_id INTO plan_moneda
    FROM plan_items 
    WHERE plan_id = calcular_costo_plan.plan_id
    LIMIT 1;
  END IF;
  
  -- Sumar costos de items en la misma moneda (considerando cantidad)
  SELECT COALESCE(SUM(costo * cantidad), 0) INTO costo_total
  FROM plan_items 
  WHERE plan_id = calcular_costo_plan.plan_id 
    AND moneda_id = plan_moneda;
  
  RETURN costo_total;
END;
$$;


--
-- Name: change_personal_password("uuid", "text"); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION "public"."change_personal_password"("p_id" "uuid", "p_password" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    PERFORM auth.admin_update_user(
        p_id,
        jsonb_build_object('password', p_password)
    );
END;
$$;


--
-- Name: create_personal_with_auth("text", "text", "text", "text", "text", "text"); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION "public"."create_personal_with_auth"("p_email" "text", "p_password" "text", "p_nombre" "text", "p_rol" "text", "p_especialidad" "text" DEFAULT NULL::"text", "p_telefono" "text" DEFAULT NULL::"text") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    new_user uuid;
BEGIN
    -- 1. Crear usuario AUTH
    new_user := (
        SELECT id FROM auth.users
        WHERE email = p_email
    );

    IF new_user IS NULL THEN
        new_user := (
            SELECT (auth.admin_create_user(
                jsonb_build_object(
                    'email', p_email,
                    'password', p_password,
                    'email_confirm', true,
                    'raw_app_meta_data', jsonb_build_object('role', p_rol)
                )
            ) ->> 'id')::uuid
        );
    END IF;

    -- 2. Crear registro en personal
    INSERT INTO public.personal(id, nombre_completo, rol, especialidad, telefono, email)
    VALUES (new_user, p_nombre, p_rol, p_especialidad, p_telefono, p_email)
    ON CONFLICT (id) DO UPDATE
    SET nombre_completo = EXCLUDED.nombre_completo,
        rol = EXCLUDED.rol,
        especialidad = EXCLUDED.especialidad,
        telefono = EXCLUDED.telefono,
        email = EXCLUDED.email;

    RETURN new_user;
END;
$$;


--
-- Name: generar_numero_historia(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION "public"."generar_numero_historia"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    año_actual INTEGER;
    proximo_numero INTEGER;
BEGIN
    -- Obtener el año actual
    año_actual := EXTRACT(YEAR FROM CURRENT_DATE);
    
    -- Insertar o actualizar el contador del año
    INSERT INTO public.numero_historia_secuencia (año, ultimo_numero)
    VALUES (año_actual, 1)
    ON CONFLICT (año) 
    DO UPDATE SET ultimo_numero = numero_historia_secuencia.ultimo_numero + 1
    RETURNING ultimo_numero INTO proximo_numero;
    
    -- Si no se insertó (ya existía), obtener el valor actualizado
    IF proximo_numero IS NULL THEN
        SELECT ultimo_numero INTO proximo_numero 
        FROM public.numero_historia_secuencia 
        WHERE año = año_actual;
    END IF;
    
    -- Generar el número de historia en formato HC-YYYY-NNNN
    NEW.numero_historia := 'HC-' || año_actual || '-' || LPAD(proximo_numero::TEXT, 4, '0');
    
    RETURN NEW;
END;
$$;


--
-- Name: limpiar_conversaciones_expiradas(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION "public"."limpiar_conversaciones_expiradas"() RETURNS integer
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM public.chatbot_conversaciones
    WHERE expires_at < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$;


--
-- Name: obtener_ajuste("text"); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION "public"."obtener_ajuste"("p_clave" "text") RETURNS "text"
    LANGUAGE "plpgsql" STABLE
    AS $$
DECLARE
    v_valor TEXT;
BEGIN
    SELECT valor INTO v_valor
    FROM public.ajustes_aplicacion
    WHERE clave = p_clave;
    
    RETURN v_valor;
END;
$$;


--
-- Name: FUNCTION "obtener_ajuste"("p_clave" "text"); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION "public"."obtener_ajuste"("p_clave" "text") IS 'Obtiene el valor de un ajuste por su clave';


--
-- Name: obtener_ajustes_por_grupo("text"); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION "public"."obtener_ajustes_por_grupo"("p_grupo" "text") RETURNS TABLE("clave" "text", "valor" "text", "tipo" "public"."tipo_ajuste", "descripcion" "text")
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.clave,
        a.valor,
        a.tipo,
        a.descripcion
    FROM public.ajustes_aplicacion a
    WHERE a.grupo = p_grupo
    ORDER BY a.orden ASC, a.clave ASC;
END;
$$;


--
-- Name: FUNCTION "obtener_ajustes_por_grupo"("p_grupo" "text"); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION "public"."obtener_ajustes_por_grupo"("p_grupo" "text") IS 'Obtiene todos los ajustes de un grupo específico';


--
-- Name: search_contexto_by_embedding("public"."vector", double precision, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION "public"."search_contexto_by_embedding"("query_embedding" "public"."vector", "match_threshold" double precision DEFAULT 0.4, "match_count" integer DEFAULT 3) RETURNS TABLE("id" "uuid", "titulo" "text", "contenido" "text", "tipo" "text", "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id, c.titulo, c.contenido, c.tipo,
    1 - (c.embedding <=> query_embedding) AS similarity
  FROM public.chatbot_contexto c
  WHERE c.activo = true AND c.embedding IS NOT NULL
    AND 1 - (c.embedding <=> query_embedding) > match_threshold
  ORDER BY c.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;


--
-- Name: FUNCTION "search_contexto_by_embedding"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION "public"."search_contexto_by_embedding"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer) IS 'Busca contexto similar usando cosine similarity con embeddings vectoriales';


--
-- Name: search_faqs_by_embedding("public"."vector", double precision, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION "public"."search_faqs_by_embedding"("query_embedding" "public"."vector", "match_threshold" double precision DEFAULT 0.5, "match_count" integer DEFAULT 5) RETURNS TABLE("id" "uuid", "pregunta" "text", "respuesta" "text", "keywords" "text"[], "categoria" "text", "prioridad" integer, "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.id,
    f.pregunta,
    f.respuesta,
    f.keywords,
    f.categoria,
    f.prioridad,
    1 - (f.embedding <=> query_embedding) AS similarity
  FROM public.chatbot_faqs f
  WHERE 
    f.activo = true 
    AND f.embedding IS NOT NULL
    AND 1 - (f.embedding <=> query_embedding) > match_threshold
  ORDER BY f.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;


--
-- Name: FUNCTION "search_faqs_by_embedding"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION "public"."search_faqs_by_embedding"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer) IS 'Busca FAQs similares usando cosine similarity con embeddings vectoriales';


--
-- Name: sync_personal_to_auth(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION "public"."sync_personal_to_auth"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    -- Actualizar email si se modificó
    IF NEW.email IS DISTINCT FROM OLD.email THEN
        PERFORM auth.admin_update_user(
            NEW.id,
            jsonb_build_object(
                'email', NEW.email
            )
        );
    END IF;

    -- Actualizar rol en metadata
    IF NEW.rol IS DISTINCT FROM OLD.rol THEN
        PERFORM auth.admin_update_user(
            NEW.id,
            jsonb_build_object(
                'raw_app_meta_data',
                jsonb_build_object('role', NEW.rol)
            )
        );
    END IF;

    RETURN NEW;
END;
$$;


--
-- Name: trigger_set_timestamp(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION "public"."trigger_set_timestamp"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


--
-- Name: update_servicio_imagenes_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION "public"."update_servicio_imagenes_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


--
-- Name: verificar_rate_limit("text", integer, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION "public"."verificar_rate_limit"("p_ip_hash" "text", "p_limite" integer DEFAULT 20, "p_ventana_minutos" integer DEFAULT 1) RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    v_record RECORD;
    v_ahora TIMESTAMPTZ := NOW();
BEGIN
    -- Buscar registro existente
    SELECT * INTO v_record FROM public.chatbot_rate_limit WHERE ip_hash = p_ip_hash;
    
    IF NOT FOUND THEN
        -- Primer request de esta IP
        INSERT INTO public.chatbot_rate_limit (ip_hash, requests_count, first_request_at, last_request_at)
        VALUES (p_ip_hash, 1, v_ahora, v_ahora);
        RETURN TRUE;
    END IF;
    
    -- Verificar si está bloqueado
    IF v_record.blocked_until IS NOT NULL AND v_record.blocked_until > v_ahora THEN
        RETURN FALSE;
    END IF;
    
    -- Verificar ventana de tiempo
    IF v_record.first_request_at < v_ahora - (p_ventana_minutos || ' minutes')::INTERVAL THEN
        -- Reiniciar contador
        UPDATE public.chatbot_rate_limit
        SET requests_count = 1, first_request_at = v_ahora, last_request_at = v_ahora, blocked_until = NULL
        WHERE ip_hash = p_ip_hash;
        RETURN TRUE;
    END IF;
    
    -- Incrementar contador
    IF v_record.requests_count >= p_limite THEN
        -- Bloquear por 5 minutos
        UPDATE public.chatbot_rate_limit
        SET blocked_until = v_ahora + INTERVAL '5 minutes', last_request_at = v_ahora
        WHERE ip_hash = p_ip_hash;
        RETURN FALSE;
    END IF;
    
    UPDATE public.chatbot_rate_limit
    SET requests_count = requests_count + 1, last_request_at = v_ahora
    WHERE ip_hash = p_ip_hash;
    
    RETURN TRUE;
END;
$$;


--
-- Name: add_prefixes("text", "text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."add_prefixes"("_bucket_id" "text", "_name" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    prefixes text[];
BEGIN
    prefixes := "storage"."get_prefixes"("_name");

    IF array_length(prefixes, 1) > 0 THEN
        INSERT INTO storage.prefixes (name, bucket_id)
        SELECT UNNEST(prefixes) as name, "_bucket_id" ON CONFLICT DO NOTHING;
    END IF;
END;
$$;


--
-- Name: can_insert_object("text", "text", "uuid", "jsonb"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."can_insert_object"("bucketid" "text", "name" "text", "owner" "uuid", "metadata" "jsonb") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


--
-- Name: delete_leaf_prefixes("text"[], "text"[]); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."delete_leaf_prefixes"("bucket_ids" "text"[], "names" "text"[]) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_rows_deleted integer;
BEGIN
    LOOP
        WITH candidates AS (
            SELECT DISTINCT
                t.bucket_id,
                unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        ),
        uniq AS (
             SELECT
                 bucket_id,
                 name,
                 storage.get_level(name) AS level
             FROM candidates
             WHERE name <> ''
             GROUP BY bucket_id, name
        ),
        leaf AS (
             SELECT
                 p.bucket_id,
                 p.name,
                 p.level
             FROM storage.prefixes AS p
                  JOIN uniq AS u
                       ON u.bucket_id = p.bucket_id
                           AND u.name = p.name
                           AND u.level = p.level
             WHERE NOT EXISTS (
                 SELECT 1
                 FROM storage.objects AS o
                 WHERE o.bucket_id = p.bucket_id
                   AND o.level = p.level + 1
                   AND o.name COLLATE "C" LIKE p.name || '/%'
             )
             AND NOT EXISTS (
                 SELECT 1
                 FROM storage.prefixes AS c
                 WHERE c.bucket_id = p.bucket_id
                   AND c.level = p.level + 1
                   AND c.name COLLATE "C" LIKE p.name || '/%'
             )
        )
        DELETE
        FROM storage.prefixes AS p
            USING leaf AS l
        WHERE p.bucket_id = l.bucket_id
          AND p.name = l.name
          AND p.level = l.level;

        GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;
        EXIT WHEN v_rows_deleted = 0;
    END LOOP;
END;
$$;


--
-- Name: delete_prefix("text", "text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."delete_prefix"("_bucket_id" "text", "_name" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    -- Check if we can delete the prefix
    IF EXISTS(
        SELECT FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name") + 1
          AND "prefixes"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    )
    OR EXISTS(
        SELECT FROM "storage"."objects"
        WHERE "objects"."bucket_id" = "_bucket_id"
          AND "storage"."get_level"("objects"."name") = "storage"."get_level"("_name") + 1
          AND "objects"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    ) THEN
    -- There are sub-objects, skip deletion
    RETURN false;
    ELSE
        DELETE FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name")
          AND "prefixes"."name" = "_name";
        RETURN true;
    END IF;
END;
$$;


--
-- Name: delete_prefix_hierarchy_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."delete_prefix_hierarchy_trigger"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    prefix text;
BEGIN
    prefix := "storage"."get_prefix"(OLD."name");

    IF coalesce(prefix, '') != '' THEN
        PERFORM "storage"."delete_prefix"(OLD."bucket_id", prefix);
    END IF;

    RETURN OLD;
END;
$$;


--
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."enforce_bucket_name_length"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


--
-- Name: extension("text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."extension"("name" "text") RETURNS "text"
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    SELECT string_to_array(name, '/') INTO _parts;
    SELECT _parts[array_length(_parts,1)] INTO _filename;
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


--
-- Name: filename("text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."filename"("name" "text") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


--
-- Name: foldername("text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."foldername"("name" "text") RETURNS "text"[]
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


--
-- Name: get_level("text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."get_level"("name" "text") RETURNS integer
    LANGUAGE "sql" IMMUTABLE STRICT
    AS $$
SELECT array_length(string_to_array("name", '/'), 1);
$$;


--
-- Name: get_prefix("text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."get_prefix"("name" "text") RETURNS "text"
    LANGUAGE "sql" IMMUTABLE STRICT
    AS $_$
SELECT
    CASE WHEN strpos("name", '/') > 0 THEN
             regexp_replace("name", '[\/]{1}[^\/]+\/?$', '')
         ELSE
             ''
        END;
$_$;


--
-- Name: get_prefixes("text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."get_prefixes"("name" "text") RETURNS "text"[]
    LANGUAGE "plpgsql" IMMUTABLE STRICT
    AS $$
DECLARE
    parts text[];
    prefixes text[];
    prefix text;
BEGIN
    -- Split the name into parts by '/'
    parts := string_to_array("name", '/');
    prefixes := '{}';

    -- Construct the prefixes, stopping one level below the last part
    FOR i IN 1..array_length(parts, 1) - 1 LOOP
            prefix := array_to_string(parts[1:i], '/');
            prefixes := array_append(prefixes, prefix);
    END LOOP;

    RETURN prefixes;
END;
$$;


--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."get_size_by_bucket"() RETURNS TABLE("size" bigint, "bucket_id" "text")
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


--
-- Name: list_multipart_uploads_with_delimiter("text", "text", "text", integer, "text", "text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."list_multipart_uploads_with_delimiter"("bucket_id" "text", "prefix_param" "text", "delimiter_param" "text", "max_keys" integer DEFAULT 100, "next_key_token" "text" DEFAULT ''::"text", "next_upload_token" "text" DEFAULT ''::"text") RETURNS TABLE("key" "text", "id" "text", "created_at" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


--
-- Name: list_objects_with_delimiter("text", "text", "text", integer, "text", "text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."list_objects_with_delimiter"("bucket_id" "text", "prefix_param" "text", "delimiter_param" "text", "max_keys" integer DEFAULT 100, "start_after" "text" DEFAULT ''::"text", "next_token" "text" DEFAULT ''::"text") RETURNS TABLE("name" "text", "id" "uuid", "metadata" "jsonb", "updated_at" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


--
-- Name: lock_top_prefixes("text"[], "text"[]); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."lock_top_prefixes"("bucket_ids" "text"[], "names" "text"[]) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_bucket text;
    v_top text;
BEGIN
    FOR v_bucket, v_top IN
        SELECT DISTINCT t.bucket_id,
            split_part(t.name, '/', 1) AS top
        FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        WHERE t.name <> ''
        ORDER BY 1, 2
        LOOP
            PERFORM pg_advisory_xact_lock(hashtextextended(v_bucket || '/' || v_top, 0));
        END LOOP;
END;
$$;


--
-- Name: objects_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."objects_delete_cleanup"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


--
-- Name: objects_insert_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."objects_insert_prefix_trigger"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    NEW.level := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


--
-- Name: objects_update_cleanup(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."objects_update_cleanup"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    -- NEW - OLD (destinations to create prefixes for)
    v_add_bucket_ids text[];
    v_add_names      text[];

    -- OLD - NEW (sources to prune)
    v_src_bucket_ids text[];
    v_src_names      text[];
BEGIN
    IF TG_OP <> 'UPDATE' THEN
        RETURN NULL;
    END IF;

    -- 1) Compute NEW−OLD (added paths) and OLD−NEW (moved-away paths)
    WITH added AS (
        SELECT n.bucket_id, n.name
        FROM new_rows n
        WHERE n.name <> '' AND position('/' in n.name) > 0
        EXCEPT
        SELECT o.bucket_id, o.name FROM old_rows o WHERE o.name <> ''
    ),
    moved AS (
         SELECT o.bucket_id, o.name
         FROM old_rows o
         WHERE o.name <> ''
         EXCEPT
         SELECT n.bucket_id, n.name FROM new_rows n WHERE n.name <> ''
    )
    SELECT
        -- arrays for ADDED (dest) in stable order
        COALESCE( (SELECT array_agg(a.bucket_id ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        COALESCE( (SELECT array_agg(a.name      ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        -- arrays for MOVED (src) in stable order
        COALESCE( (SELECT array_agg(m.bucket_id ORDER BY m.bucket_id, m.name) FROM moved m), '{}' ),
        COALESCE( (SELECT array_agg(m.name      ORDER BY m.bucket_id, m.name) FROM moved m), '{}' )
    INTO v_add_bucket_ids, v_add_names, v_src_bucket_ids, v_src_names;

    -- Nothing to do?
    IF (array_length(v_add_bucket_ids, 1) IS NULL) AND (array_length(v_src_bucket_ids, 1) IS NULL) THEN
        RETURN NULL;
    END IF;

    -- 2) Take per-(bucket, top) locks: ALL prefixes in consistent global order to prevent deadlocks
    DECLARE
        v_all_bucket_ids text[];
        v_all_names text[];
    BEGIN
        -- Combine source and destination arrays for consistent lock ordering
        v_all_bucket_ids := COALESCE(v_src_bucket_ids, '{}') || COALESCE(v_add_bucket_ids, '{}');
        v_all_names := COALESCE(v_src_names, '{}') || COALESCE(v_add_names, '{}');

        -- Single lock call ensures consistent global ordering across all transactions
        IF array_length(v_all_bucket_ids, 1) IS NOT NULL THEN
            PERFORM storage.lock_top_prefixes(v_all_bucket_ids, v_all_names);
        END IF;
    END;

    -- 3) Create destination prefixes (NEW−OLD) BEFORE pruning sources
    IF array_length(v_add_bucket_ids, 1) IS NOT NULL THEN
        WITH candidates AS (
            SELECT DISTINCT t.bucket_id, unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(v_add_bucket_ids, v_add_names) AS t(bucket_id, name)
            WHERE name <> ''
        )
        INSERT INTO storage.prefixes (bucket_id, name)
        SELECT c.bucket_id, c.name
        FROM candidates c
        ON CONFLICT DO NOTHING;
    END IF;

    -- 4) Prune source prefixes bottom-up for OLD−NEW
    IF array_length(v_src_bucket_ids, 1) IS NOT NULL THEN
        -- re-entrancy guard so DELETE on prefixes won't recurse
        IF current_setting('storage.gc.prefixes', true) <> '1' THEN
            PERFORM set_config('storage.gc.prefixes', '1', true);
        END IF;

        PERFORM storage.delete_leaf_prefixes(v_src_bucket_ids, v_src_names);
    END IF;

    RETURN NULL;
END;
$$;


--
-- Name: objects_update_level_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."objects_update_level_trigger"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Set the new level
        NEW."level" := "storage"."get_level"(NEW."name");
    END IF;
    RETURN NEW;
END;
$$;


--
-- Name: objects_update_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."objects_update_prefix_trigger"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    old_prefixes TEXT[];
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Retrieve old prefixes
        old_prefixes := "storage"."get_prefixes"(OLD."name");

        -- Remove old prefixes that are only used by this object
        WITH all_prefixes as (
            SELECT unnest(old_prefixes) as prefix
        ),
        can_delete_prefixes as (
             SELECT prefix
             FROM all_prefixes
             WHERE NOT EXISTS (
                 SELECT 1 FROM "storage"."objects"
                 WHERE "bucket_id" = OLD."bucket_id"
                   AND "name" <> OLD."name"
                   AND "name" LIKE (prefix || '%')
             )
         )
        DELETE FROM "storage"."prefixes" WHERE name IN (SELECT prefix FROM can_delete_prefixes);

        -- Add new prefixes
        PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    END IF;
    -- Set the new level
    NEW."level" := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."operation"() RETURNS "text"
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


--
-- Name: prefixes_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."prefixes_delete_cleanup"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


--
-- Name: prefixes_insert_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."prefixes_insert_trigger"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    RETURN NEW;
END;
$$;


--
-- Name: search("text", "text", integer, integer, integer, "text", "text", "text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."search"("prefix" "text", "bucketname" "text", "limits" integer DEFAULT 100, "levels" integer DEFAULT 1, "offsets" integer DEFAULT 0, "search" "text" DEFAULT ''::"text", "sortcolumn" "text" DEFAULT 'name'::"text", "sortorder" "text" DEFAULT 'asc'::"text") RETURNS TABLE("name" "text", "id" "uuid", "updated_at" timestamp with time zone, "created_at" timestamp with time zone, "last_accessed_at" timestamp with time zone, "metadata" "jsonb")
    LANGUAGE "plpgsql"
    AS $$
declare
    can_bypass_rls BOOLEAN;
begin
    SELECT rolbypassrls
    INTO can_bypass_rls
    FROM pg_roles
    WHERE rolname = coalesce(nullif(current_setting('role', true), 'none'), current_user);

    IF can_bypass_rls THEN
        RETURN QUERY SELECT * FROM storage.search_v1_optimised(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    ELSE
        RETURN QUERY SELECT * FROM storage.search_legacy_v1(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    END IF;
end;
$$;


--
-- Name: search_legacy_v1("text", "text", integer, integer, integer, "text", "text", "text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."search_legacy_v1"("prefix" "text", "bucketname" "text", "limits" integer DEFAULT 100, "levels" integer DEFAULT 1, "offsets" integer DEFAULT 0, "search" "text" DEFAULT ''::"text", "sortcolumn" "text" DEFAULT 'name'::"text", "sortorder" "text" DEFAULT 'asc'::"text") RETURNS TABLE("name" "text", "id" "uuid", "updated_at" timestamp with time zone, "created_at" timestamp with time zone, "last_accessed_at" timestamp with time zone, "metadata" "jsonb")
    LANGUAGE "plpgsql" STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select path_tokens[$1] as folder
           from storage.objects
             where objects.name ilike $2 || $3 || ''%''
               and bucket_id = $4
               and array_length(objects.path_tokens, 1) <> $1
           group by folder
           order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


--
-- Name: search_v1_optimised("text", "text", integer, integer, integer, "text", "text", "text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."search_v1_optimised"("prefix" "text", "bucketname" "text", "limits" integer DEFAULT 100, "levels" integer DEFAULT 1, "offsets" integer DEFAULT 0, "search" "text" DEFAULT ''::"text", "sortcolumn" "text" DEFAULT 'name'::"text", "sortorder" "text" DEFAULT 'asc'::"text") RETURNS TABLE("name" "text", "id" "uuid", "updated_at" timestamp with time zone, "created_at" timestamp with time zone, "last_accessed_at" timestamp with time zone, "metadata" "jsonb")
    LANGUAGE "plpgsql" STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select (string_to_array(name, ''/''))[level] as name
           from storage.prefixes
             where lower(prefixes.name) like lower($2 || $3) || ''%''
               and bucket_id = $4
               and level = $1
           order by name ' || v_sort_order || '
     )
     (select name,
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[level] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where lower(objects.name) like lower($2 || $3) || ''%''
       and bucket_id = $4
       and level = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


--
-- Name: search_v2("text", "text", integer, integer, "text", "text", "text", "text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."search_v2"("prefix" "text", "bucket_name" "text", "limits" integer DEFAULT 100, "levels" integer DEFAULT 1, "start_after" "text" DEFAULT ''::"text", "sort_order" "text" DEFAULT 'asc'::"text", "sort_column" "text" DEFAULT 'name'::"text", "sort_column_after" "text" DEFAULT ''::"text") RETURNS TABLE("key" "text", "name" "text", "id" "uuid", "updated_at" timestamp with time zone, "created_at" timestamp with time zone, "last_accessed_at" timestamp with time zone, "metadata" "jsonb")
    LANGUAGE "plpgsql" STABLE
    AS $_$
DECLARE
    sort_col text;
    sort_ord text;
    cursor_op text;
    cursor_expr text;
    sort_expr text;
BEGIN
    -- Validate sort_order
    sort_ord := lower(sort_order);
    IF sort_ord NOT IN ('asc', 'desc') THEN
        sort_ord := 'asc';
    END IF;

    -- Determine cursor comparison operator
    IF sort_ord = 'asc' THEN
        cursor_op := '>';
    ELSE
        cursor_op := '<';
    END IF;
    
    sort_col := lower(sort_column);
    -- Validate sort column  
    IF sort_col IN ('updated_at', 'created_at') THEN
        cursor_expr := format(
            '($5 = '''' OR ROW(date_trunc(''milliseconds'', %I), name COLLATE "C") %s ROW(COALESCE(NULLIF($6, '''')::timestamptz, ''epoch''::timestamptz), $5))',
            sort_col, cursor_op
        );
        sort_expr := format(
            'COALESCE(date_trunc(''milliseconds'', %I), ''epoch''::timestamptz) %s, name COLLATE "C" %s',
            sort_col, sort_ord, sort_ord
        );
    ELSE
        cursor_expr := format('($5 = '''' OR name COLLATE "C" %s $5)', cursor_op);
        sort_expr := format('name COLLATE "C" %s', sort_ord);
    END IF;

    RETURN QUERY EXECUTE format(
        $sql$
        SELECT * FROM (
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    NULL::uuid AS id,
                    updated_at,
                    created_at,
                    NULL::timestamptz AS last_accessed_at,
                    NULL::jsonb AS metadata
                FROM storage.prefixes
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
            UNION ALL
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    id,
                    updated_at,
                    created_at,
                    last_accessed_at,
                    metadata
                FROM storage.objects
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
        ) obj
        ORDER BY %s
        LIMIT $3
        $sql$,
        cursor_expr,    -- prefixes WHERE
        sort_expr,      -- prefixes ORDER BY
        cursor_expr,    -- objects WHERE
        sort_expr,      -- objects ORDER BY
        sort_expr       -- final ORDER BY
    )
    USING prefix, bucket_name, limits, levels, start_after, sort_column_after;
END;
$_$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = "heap";

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."audit_log_entries" (
    "instance_id" "uuid",
    "id" "uuid" NOT NULL,
    "payload" json,
    "created_at" timestamp with time zone,
    "ip_address" character varying(64) DEFAULT ''::character varying NOT NULL
);


--
-- Name: TABLE "audit_log_entries"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."audit_log_entries" IS 'Auth: Audit trail for user actions.';


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."flow_state" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid",
    "auth_code" "text" NOT NULL,
    "code_challenge_method" "auth"."code_challenge_method" NOT NULL,
    "code_challenge" "text" NOT NULL,
    "provider_type" "text" NOT NULL,
    "provider_access_token" "text",
    "provider_refresh_token" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "authentication_method" "text" NOT NULL,
    "auth_code_issued_at" timestamp with time zone
);


--
-- Name: TABLE "flow_state"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."flow_state" IS 'stores metadata for pkce logins';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."identities" (
    "provider_id" "text" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "identity_data" "jsonb" NOT NULL,
    "provider" "text" NOT NULL,
    "last_sign_in_at" timestamp with time zone,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "email" "text" GENERATED ALWAYS AS ("lower"(("identity_data" ->> 'email'::"text"))) STORED,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


--
-- Name: TABLE "identities"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."identities" IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN "identities"."email"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN "auth"."identities"."email" IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."instances" (
    "id" "uuid" NOT NULL,
    "uuid" "uuid",
    "raw_base_config" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone
);


--
-- Name: TABLE "instances"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."instances" IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."mfa_amr_claims" (
    "session_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "authentication_method" "text" NOT NULL,
    "id" "uuid" NOT NULL
);


--
-- Name: TABLE "mfa_amr_claims"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."mfa_amr_claims" IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."mfa_challenges" (
    "id" "uuid" NOT NULL,
    "factor_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "verified_at" timestamp with time zone,
    "ip_address" "inet" NOT NULL,
    "otp_code" "text",
    "web_authn_session_data" "jsonb"
);


--
-- Name: TABLE "mfa_challenges"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."mfa_challenges" IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."mfa_factors" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "friendly_name" "text",
    "factor_type" "auth"."factor_type" NOT NULL,
    "status" "auth"."factor_status" NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "secret" "text",
    "phone" "text",
    "last_challenged_at" timestamp with time zone,
    "web_authn_credential" "jsonb",
    "web_authn_aaguid" "uuid",
    "last_webauthn_challenge_data" "jsonb"
);


--
-- Name: TABLE "mfa_factors"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."mfa_factors" IS 'auth: stores metadata about factors';


--
-- Name: COLUMN "mfa_factors"."last_webauthn_challenge_data"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN "auth"."mfa_factors"."last_webauthn_challenge_data" IS 'Stores the latest WebAuthn challenge data including attestation/assertion for customer verification';


--
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."oauth_authorizations" (
    "id" "uuid" NOT NULL,
    "authorization_id" "text" NOT NULL,
    "client_id" "uuid" NOT NULL,
    "user_id" "uuid",
    "redirect_uri" "text" NOT NULL,
    "scope" "text" NOT NULL,
    "state" "text",
    "resource" "text",
    "code_challenge" "text",
    "code_challenge_method" "auth"."code_challenge_method",
    "response_type" "auth"."oauth_response_type" DEFAULT 'code'::"auth"."oauth_response_type" NOT NULL,
    "status" "auth"."oauth_authorization_status" DEFAULT 'pending'::"auth"."oauth_authorization_status" NOT NULL,
    "authorization_code" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "expires_at" timestamp with time zone DEFAULT ("now"() + '00:03:00'::interval) NOT NULL,
    "approved_at" timestamp with time zone,
    "nonce" "text",
    CONSTRAINT "oauth_authorizations_authorization_code_length" CHECK (("char_length"("authorization_code") <= 255)),
    CONSTRAINT "oauth_authorizations_code_challenge_length" CHECK (("char_length"("code_challenge") <= 128)),
    CONSTRAINT "oauth_authorizations_expires_at_future" CHECK (("expires_at" > "created_at")),
    CONSTRAINT "oauth_authorizations_nonce_length" CHECK (("char_length"("nonce") <= 255)),
    CONSTRAINT "oauth_authorizations_redirect_uri_length" CHECK (("char_length"("redirect_uri") <= 2048)),
    CONSTRAINT "oauth_authorizations_resource_length" CHECK (("char_length"("resource") <= 2048)),
    CONSTRAINT "oauth_authorizations_scope_length" CHECK (("char_length"("scope") <= 4096)),
    CONSTRAINT "oauth_authorizations_state_length" CHECK (("char_length"("state") <= 4096))
);


--
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."oauth_clients" (
    "id" "uuid" NOT NULL,
    "client_secret_hash" "text",
    "registration_type" "auth"."oauth_registration_type" NOT NULL,
    "redirect_uris" "text" NOT NULL,
    "grant_types" "text" NOT NULL,
    "client_name" "text",
    "client_uri" "text",
    "logo_uri" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "deleted_at" timestamp with time zone,
    "client_type" "auth"."oauth_client_type" DEFAULT 'confidential'::"auth"."oauth_client_type" NOT NULL,
    CONSTRAINT "oauth_clients_client_name_length" CHECK (("char_length"("client_name") <= 1024)),
    CONSTRAINT "oauth_clients_client_uri_length" CHECK (("char_length"("client_uri") <= 2048)),
    CONSTRAINT "oauth_clients_logo_uri_length" CHECK (("char_length"("logo_uri") <= 2048))
);


--
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."oauth_consents" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "client_id" "uuid" NOT NULL,
    "scopes" "text" NOT NULL,
    "granted_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "revoked_at" timestamp with time zone,
    CONSTRAINT "oauth_consents_revoked_after_granted" CHECK ((("revoked_at" IS NULL) OR ("revoked_at" >= "granted_at"))),
    CONSTRAINT "oauth_consents_scopes_length" CHECK (("char_length"("scopes") <= 2048)),
    CONSTRAINT "oauth_consents_scopes_not_empty" CHECK (("char_length"(TRIM(BOTH FROM "scopes")) > 0))
);


--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."one_time_tokens" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "token_type" "auth"."one_time_token_type" NOT NULL,
    "token_hash" "text" NOT NULL,
    "relates_to" "text" NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "one_time_tokens_token_hash_check" CHECK (("char_length"("token_hash") > 0))
);


--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."refresh_tokens" (
    "instance_id" "uuid",
    "id" bigint NOT NULL,
    "token" character varying(255),
    "user_id" character varying(255),
    "revoked" boolean,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "parent" character varying(255),
    "session_id" "uuid"
);


--
-- Name: TABLE "refresh_tokens"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."refresh_tokens" IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: -
--

CREATE SEQUENCE "auth"."refresh_tokens_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: -
--

ALTER SEQUENCE "auth"."refresh_tokens_id_seq" OWNED BY "auth"."refresh_tokens"."id";


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."saml_providers" (
    "id" "uuid" NOT NULL,
    "sso_provider_id" "uuid" NOT NULL,
    "entity_id" "text" NOT NULL,
    "metadata_xml" "text" NOT NULL,
    "metadata_url" "text",
    "attribute_mapping" "jsonb",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "name_id_format" "text",
    CONSTRAINT "entity_id not empty" CHECK (("char_length"("entity_id") > 0)),
    CONSTRAINT "metadata_url not empty" CHECK ((("metadata_url" = NULL::"text") OR ("char_length"("metadata_url") > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK (("char_length"("metadata_xml") > 0))
);


--
-- Name: TABLE "saml_providers"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."saml_providers" IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."saml_relay_states" (
    "id" "uuid" NOT NULL,
    "sso_provider_id" "uuid" NOT NULL,
    "request_id" "text" NOT NULL,
    "for_email" "text",
    "redirect_to" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "flow_state_id" "uuid",
    CONSTRAINT "request_id not empty" CHECK (("char_length"("request_id") > 0))
);


--
-- Name: TABLE "saml_relay_states"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."saml_relay_states" IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."schema_migrations" (
    "version" character varying(255) NOT NULL
);


--
-- Name: TABLE "schema_migrations"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."schema_migrations" IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."sessions" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "factor_id" "uuid",
    "aal" "auth"."aal_level",
    "not_after" timestamp with time zone,
    "refreshed_at" timestamp without time zone,
    "user_agent" "text",
    "ip" "inet",
    "tag" "text",
    "oauth_client_id" "uuid",
    "refresh_token_hmac_key" "text",
    "refresh_token_counter" bigint,
    "scopes" "text",
    CONSTRAINT "sessions_scopes_length" CHECK (("char_length"("scopes") <= 4096))
);


--
-- Name: TABLE "sessions"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."sessions" IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN "sessions"."not_after"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN "auth"."sessions"."not_after" IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: COLUMN "sessions"."refresh_token_hmac_key"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN "auth"."sessions"."refresh_token_hmac_key" IS 'Holds a HMAC-SHA256 key used to sign refresh tokens for this session.';


--
-- Name: COLUMN "sessions"."refresh_token_counter"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN "auth"."sessions"."refresh_token_counter" IS 'Holds the ID (counter) of the last issued refresh token.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."sso_domains" (
    "id" "uuid" NOT NULL,
    "sso_provider_id" "uuid" NOT NULL,
    "domain" "text" NOT NULL,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK (("char_length"("domain") > 0))
);


--
-- Name: TABLE "sso_domains"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."sso_domains" IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."sso_providers" (
    "id" "uuid" NOT NULL,
    "resource_id" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "disabled" boolean,
    CONSTRAINT "resource_id not empty" CHECK ((("resource_id" = NULL::"text") OR ("char_length"("resource_id") > 0)))
);


--
-- Name: TABLE "sso_providers"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."sso_providers" IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN "sso_providers"."resource_id"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN "auth"."sso_providers"."resource_id" IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."users" (
    "instance_id" "uuid",
    "id" "uuid" NOT NULL,
    "aud" character varying(255),
    "role" character varying(255),
    "email" character varying(255),
    "encrypted_password" character varying(255),
    "email_confirmed_at" timestamp with time zone,
    "invited_at" timestamp with time zone,
    "confirmation_token" character varying(255),
    "confirmation_sent_at" timestamp with time zone,
    "recovery_token" character varying(255),
    "recovery_sent_at" timestamp with time zone,
    "email_change_token_new" character varying(255),
    "email_change" character varying(255),
    "email_change_sent_at" timestamp with time zone,
    "last_sign_in_at" timestamp with time zone,
    "raw_app_meta_data" "jsonb",
    "raw_user_meta_data" "jsonb",
    "is_super_admin" boolean,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "phone" "text" DEFAULT NULL::character varying,
    "phone_confirmed_at" timestamp with time zone,
    "phone_change" "text" DEFAULT ''::character varying,
    "phone_change_token" character varying(255) DEFAULT ''::character varying,
    "phone_change_sent_at" timestamp with time zone,
    "confirmed_at" timestamp with time zone GENERATED ALWAYS AS (LEAST("email_confirmed_at", "phone_confirmed_at")) STORED,
    "email_change_token_current" character varying(255) DEFAULT ''::character varying,
    "email_change_confirm_status" smallint DEFAULT 0,
    "banned_until" timestamp with time zone,
    "reauthentication_token" character varying(255) DEFAULT ''::character varying,
    "reauthentication_sent_at" timestamp with time zone,
    "is_sso_user" boolean DEFAULT false NOT NULL,
    "deleted_at" timestamp with time zone,
    "is_anonymous" boolean DEFAULT false NOT NULL,
    CONSTRAINT "users_email_change_confirm_status_check" CHECK ((("email_change_confirm_status" >= 0) AND ("email_change_confirm_status" <= 2)))
);


--
-- Name: TABLE "users"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."users" IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN "users"."is_sso_user"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN "auth"."users"."is_sso_user" IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: ajustes_aplicacion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."ajustes_aplicacion" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "clave" "text" NOT NULL,
    "valor" "text",
    "grupo" "text" NOT NULL,
    "tipo" "public"."tipo_ajuste" NOT NULL,
    "descripcion" "text",
    "orden" integer DEFAULT 0,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"()
);


--
-- Name: TABLE "ajustes_aplicacion"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE "public"."ajustes_aplicacion" IS 'Almacena configuraciones clave-valor para la personalización de la UI y funcionalidades de la aplicación.';


--
-- Name: COLUMN "ajustes_aplicacion"."clave"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."ajustes_aplicacion"."clave" IS 'Identificador único usado en el código. Ej: theme.color.primary';


--
-- Name: COLUMN "ajustes_aplicacion"."grupo"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."ajustes_aplicacion"."grupo" IS 'Categoría para agrupar ajustes. Ej: Tema, Landing Page, Contacto';


--
-- Name: antecedentes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."antecedentes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "historia_id" "uuid" NOT NULL,
    "categoria" "text" NOT NULL,
    "datos" "jsonb" NOT NULL,
    "fecha_registro" timestamp without time zone DEFAULT "now"(),
    "no_refiere" boolean DEFAULT false
);


--
-- Name: casos_clinicos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."casos_clinicos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "historia_id" "uuid" NOT NULL,
    "nombre_caso" "text" NOT NULL,
    "descripcion" "text",
    "diagnostico_preliminar" "text",
    "fecha_inicio" timestamp with time zone DEFAULT "now"(),
    "fecha_cierre" timestamp with time zone,
    "estado" "text" DEFAULT 'Abierto'::"text",
    "presupuesto_id" "uuid"
);


--
-- Name: chatbot_cola; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."chatbot_cola" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "session_id" "text" NOT NULL,
    "mensaje" "text" NOT NULL,
    "intentos" integer DEFAULT 0,
    "max_intentos" integer DEFAULT 3,
    "estado" "text" DEFAULT 'pendiente'::"text",
    "error_mensaje" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "processed_at" timestamp with time zone,
    CONSTRAINT "chatbot_cola_estado_check" CHECK (("estado" = ANY (ARRAY['pendiente'::"text", 'procesando'::"text", 'completado'::"text", 'fallido'::"text"])))
);


--
-- Name: chatbot_contexto; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."chatbot_contexto" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "titulo" "text" NOT NULL,
    "contenido" "text" NOT NULL,
    "tipo" "text" DEFAULT 'informacion'::"text",
    "activo" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "embedding" "public"."vector"(768),
    "embedding_updated_at" timestamp with time zone
);


--
-- Name: chatbot_conversaciones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."chatbot_conversaciones" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "session_id" "text" NOT NULL,
    "pregunta" "text" NOT NULL,
    "respuesta" "text",
    "modelo" "text",
    "tokens_usados" integer,
    "tiempo_respuesta_ms" integer,
    "error_tipo" "text",
    "ip_hash" "text",
    "user_agent" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "expires_at" timestamp with time zone DEFAULT ("now"() + '30 days'::interval)
);


--
-- Name: chatbot_faqs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."chatbot_faqs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "pregunta" "text" NOT NULL,
    "respuesta" "text" NOT NULL,
    "keywords" "text"[] DEFAULT '{}'::"text"[],
    "categoria" "text" DEFAULT 'general'::"text",
    "prioridad" integer DEFAULT 0,
    "activo" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "embedding" "public"."vector"(768),
    "embedding_updated_at" timestamp with time zone
);


--
-- Name: COLUMN "chatbot_faqs"."embedding"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."chatbot_faqs"."embedding" IS 'Vector de embeddings generado por Google Gemini (768 dimensiones)';


--
-- Name: COLUMN "chatbot_faqs"."embedding_updated_at"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."chatbot_faqs"."embedding_updated_at" IS 'Timestamp de la última actualización del embedding';


--
-- Name: chatbot_rate_limit; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."chatbot_rate_limit" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "ip_hash" "text" NOT NULL,
    "requests_count" integer DEFAULT 1,
    "first_request_at" timestamp with time zone DEFAULT "now"(),
    "last_request_at" timestamp with time zone DEFAULT "now"(),
    "blocked_until" timestamp with time zone
);


--
-- Name: cie10_catalogo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."cie10_catalogo" (
    "id" integer NOT NULL,
    "codigo" "text" NOT NULL,
    "descripcion" "text" NOT NULL
);


--
-- Name: cie10_catalogo_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."cie10_catalogo_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cie10_catalogo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."cie10_catalogo_id_seq" OWNED BY "public"."cie10_catalogo"."id";


--
-- Name: citas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."citas" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "paciente_id" "uuid" NOT NULL,
    "odontologo_id" "uuid" NOT NULL,
    "fecha_inicio" timestamp with time zone NOT NULL,
    "fecha_fin" timestamp with time zone NOT NULL,
    "estado" "public"."estado_cita" DEFAULT 'Programada'::"public"."estado_cita",
    "motivo" "text",
    "costo_total" numeric(10,2),
    "moneda_id" "uuid",
    "google_calendar_event_id" "text",
    "notas" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "nombre_cita" "text",
    "caso_id" "uuid"
);


--
-- Name: cms_carrusel; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."cms_carrusel" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "imagen_url" "text" NOT NULL,
    "alt_text" "text",
    "orden" integer DEFAULT 0,
    "visible" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"()
);


--
-- Name: cms_equipo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."cms_equipo" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "nombre" "text" NOT NULL,
    "cargo" "text",
    "especialidad" "text",
    "foto_url" "text",
    "orden" integer DEFAULT 0,
    "visible" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "foto_public_id" "text",
    "curriculum" "jsonb"
);


--
-- Name: COLUMN "cms_equipo"."foto_public_id"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."cms_equipo"."foto_public_id" IS 'Public ID de Cloudinary para poder eliminar la imagen';


--
-- Name: COLUMN "cms_equipo"."curriculum"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."cms_equipo"."curriculum" IS 'Curriculum vitae del miembro del equipo en formato JSON';


--
-- Name: cms_secciones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."cms_secciones" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "seccion" "text" NOT NULL,
    "titulo" "text",
    "subtitulo" "text",
    "contenido" "jsonb" DEFAULT '{}'::"jsonb",
    "orden" integer DEFAULT 0,
    "visible" boolean DEFAULT true,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid"
);


--
-- Name: cms_servicio_imagenes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."cms_servicio_imagenes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "servicio_id" "uuid" NOT NULL,
    "imagen_url" "text" NOT NULL,
    "public_id" "text",
    "descripcion" "text",
    "alt_text" "text",
    "orden" integer DEFAULT 0,
    "visible" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


--
-- Name: cms_servicios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."cms_servicios" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "nombre" "text" NOT NULL,
    "descripcion" "text",
    "icono" "text" DEFAULT 'Stethoscope'::"text",
    "orden" integer DEFAULT 0,
    "visible" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "detalle_completo" "text",
    "beneficios" "text"[],
    "duracion" character varying(100),
    "recomendaciones" "text"
);


--
-- Name: COLUMN "cms_servicios"."detalle_completo"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."cms_servicios"."detalle_completo" IS 'Descripción extendida del servicio para el modal de detalles';


--
-- Name: COLUMN "cms_servicios"."beneficios"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."cms_servicios"."beneficios" IS 'Lista de beneficios del servicio';


--
-- Name: COLUMN "cms_servicios"."duracion"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."cms_servicios"."duracion" IS 'Tiempo estimado del tratamiento';


--
-- Name: COLUMN "cms_servicios"."recomendaciones"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."cms_servicios"."recomendaciones" IS 'Consejos para el paciente sobre este servicio';


--
-- Name: cms_tema; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."cms_tema" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "clave" "text" NOT NULL,
    "valor" "text" NOT NULL,
    "tipo" "text" NOT NULL,
    "descripcion" "text",
    "grupo" "text" DEFAULT 'general'::"text",
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "cms_tema_tipo_check" CHECK (("tipo" = ANY (ARRAY['color'::"text", 'fuente'::"text", 'tamaño'::"text", 'otro'::"text"])))
);


--
-- Name: codigos_invitacion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."codigos_invitacion" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "codigo" "text" NOT NULL,
    "creado_por" "uuid",
    "usado_por" "uuid",
    "rol_asignado" "text" DEFAULT 'Odontólogo'::"text",
    "usos_maximos" integer DEFAULT 1,
    "usos_actuales" integer DEFAULT 0,
    "activo" boolean DEFAULT true,
    "expira_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "used_at" timestamp with time zone
);


--
-- Name: config_seguridad; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."config_seguridad" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "clave" "text" NOT NULL,
    "valor" "text" NOT NULL,
    "descripcion" "text",
    "updated_at" timestamp with time zone DEFAULT "now"()
);


--
-- Name: consentimientos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."consentimientos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "caso_id" "uuid" NOT NULL,
    "paciente_id" "uuid" NOT NULL,
    "tipo" "text" NOT NULL,
    "documento_url" "text",
    "firmado" boolean DEFAULT false,
    "firmado_por" "uuid",
    "fecha_firma" timestamp with time zone
);


--
-- Name: cuestionario_respuestas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."cuestionario_respuestas" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "historia_id" "uuid" NOT NULL,
    "seccion" "text" NOT NULL,
    "pregunta" "text" NOT NULL,
    "respuesta_si_no" boolean,
    "respuesta_texto" "text",
    "respuesta_opciones" "text"[],
    "detalle" "text"
);


--
-- Name: diagnosticos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."diagnosticos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "caso_id" "uuid" NOT NULL,
    "odontologo_id" "uuid" NOT NULL,
    "tipo" "text" NOT NULL,
    "fecha" timestamp with time zone DEFAULT "now"(),
    "cie10_id" integer NOT NULL
);


--
-- Name: TABLE "diagnosticos"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE "public"."diagnosticos" IS 'Diagnósticos asociados a casos clínicos. Incluye código CIE10 y descripción.';


--
-- Name: grupos_procedimiento; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."grupos_procedimiento" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "nombre" "text" NOT NULL,
    "descripcion" "text",
    "unidad_id" "uuid"
);


--
-- Name: historias_clinicas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."historias_clinicas" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "paciente_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


--
-- Name: imagenes_pacientes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."imagenes_pacientes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "paciente_id" "uuid" NOT NULL,
    "tipo" "text" NOT NULL,
    "url" "text" NOT NULL,
    "public_id" "text" NOT NULL,
    "fecha_subida" timestamp with time zone DEFAULT "now"() NOT NULL,
    "descripcion" "text",
    "caso_id" "uuid",
    "etapa" "text" DEFAULT 'durante'::"text",
    "fecha_captura" "date",
    "es_principal" boolean DEFAULT false,
    CONSTRAINT "imagenes_pacientes_etapa_check" CHECK (("etapa" = ANY (ARRAY['antes'::"text", 'durante'::"text", 'despues'::"text", 'seguimiento'::"text"])))
);


--
-- Name: monedas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."monedas" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "codigo" "text" NOT NULL,
    "nombre" "text" NOT NULL,
    "simbolo" "text" NOT NULL
);


--
-- Name: numero_historia_secuencia; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."numero_historia_secuencia" (
    "año" integer NOT NULL,
    "ultimo_numero" integer DEFAULT 0 NOT NULL
);


--
-- Name: odontogramas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."odontogramas" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "paciente_id" "uuid" NOT NULL,
    "odontograma_data" "jsonb",
    "fecha_registro" timestamp with time zone DEFAULT "now"(),
    "version" integer NOT NULL,
    "especificaciones" "text",
    "observaciones" "text"
);


--
-- Name: pacientes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."pacientes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "nombres" "text" NOT NULL,
    "apellidos" "text" NOT NULL,
    "fecha_nacimiento" "date" NOT NULL,
    "dni" "text" NOT NULL,
    "genero" "text",
    "ocupacion" "text",
    "telefono" "text",
    "email" "text",
    "direccion" "text",
    "lugar_procedencia" "text",
    "alerta_medica" "text",
    "antecedentes_patologicos" "jsonb",
    "habitos" "jsonb",
    "talla_m" numeric(3,2),
    "peso_kg" numeric(5,2),
    "imc" numeric(4,2),
    "presion_arterial" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "numero_historia" "text",
    "grado_instruccion" "text",
    "pais" "text",
    "departamento" "text",
    "provincia" "text",
    "distrito" "text",
    "contacto_emergencia" "jsonb",
    "recomendado_por" "text",
    "observaciones" "text",
    "estado_civil" character varying(50)
);


--
-- Name: pagos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."pagos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "presupuesto_id" "uuid" NOT NULL,
    "paciente_id" "uuid" NOT NULL,
    "monto" numeric NOT NULL,
    "moneda_id" "uuid" NOT NULL,
    "metodo_pago" "text" DEFAULT 'efectivo'::"text" NOT NULL,
    "numero_comprobante" "text",
    "tipo_comprobante" "text" DEFAULT 'boleta'::"text",
    "notas" "text",
    "recibido_por" "uuid",
    "fecha_pago" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


--
-- Name: TABLE "pagos"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE "public"."pagos" IS 'Registro de pagos/abonos realizados a presupuestos';


--
-- Name: COLUMN "pagos"."metodo_pago"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."pagos"."metodo_pago" IS 'Método de pago: efectivo, tarjeta, transferencia, yape, plin';


--
-- Name: COLUMN "pagos"."tipo_comprobante"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."pagos"."tipo_comprobante" IS 'Tipo de comprobante: boleta, factura, ticket';


--
-- Name: personal; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."personal" (
    "id" "uuid" NOT NULL,
    "nombre_completo" "text" NOT NULL,
    "rol" "public"."rol" NOT NULL,
    "especialidad" "text",
    "telefono" "text",
    "email" "text",
    "activo" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"()
);


--
-- Name: plan_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."plan_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "plan_id" "uuid" NOT NULL,
    "procedimiento_id" "uuid" NOT NULL,
    "moneda_id" "uuid" NOT NULL,
    "estado" "public"."item_status" DEFAULT 'Pendiente'::"public"."item_status",
    "costo" numeric(10,2) NOT NULL,
    "cantidad" integer DEFAULT 1,
    "pieza_dental" "text",
    "notas" "text",
    "orden_ejecucion" integer
);


--
-- Name: planes_procedimiento; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."planes_procedimiento" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "paciente_id" "uuid" NOT NULL,
    "nombre" "text" NOT NULL,
    "costo_total" numeric(10,2),
    "moneda_id" "uuid",
    "estado" "public"."plan_status" DEFAULT 'Propuesto'::"public"."plan_status",
    "fecha_creacion" timestamp with time zone DEFAULT "now"(),
    "caso_id" "uuid"
);


--
-- Name: presupuesto_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."presupuesto_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "presupuesto_id" "uuid" NOT NULL,
    "procedimiento_id" "uuid",
    "nombre_procedimiento" "text" NOT NULL,
    "pieza_dental" "text",
    "cantidad" integer DEFAULT 1 NOT NULL,
    "costo_unitario" numeric(10,2) NOT NULL,
    "descuento_porcentaje" numeric(5,2) DEFAULT 0,
    "costo_final" numeric(10,2) NOT NULL,
    "estado" "text" DEFAULT 'Pendiente'::"text" NOT NULL,
    "orden_ejecucion" integer,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


--
-- Name: presupuestos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."presupuestos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "paciente_id" "uuid" NOT NULL,
    "caso_id" "uuid" NOT NULL,
    "medico_id" "uuid",
    "nombre" "text" NOT NULL,
    "observacion" "text",
    "especialidad" "text",
    "costo_total" numeric(10,2) NOT NULL,
    "estado" "text" DEFAULT 'Por Cobrar'::"text" NOT NULL,
    "fecha_creacion" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "moneda_id" "uuid",
    "descuento_global" numeric DEFAULT 0,
    "total_pagado" numeric DEFAULT 0,
    "saldo_pendiente" numeric GENERATED ALWAYS AS (("costo_total" - COALESCE("total_pagado", (0)::numeric))) STORED
);


--
-- Name: procedimiento_precios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."procedimiento_precios" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "procedimiento_id" "uuid" NOT NULL,
    "moneda_id" "uuid" NOT NULL,
    "precio" numeric(10,2) NOT NULL,
    "vigente_desde" "date" DEFAULT CURRENT_DATE,
    "vigente_hasta" "date",
    "created_at" timestamp with time zone DEFAULT "now"()
);


--
-- Name: procedimientos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."procedimientos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "nombre" "text" NOT NULL,
    "descripcion" "text",
    "unidad_id" "uuid",
    "grupo_id" "uuid",
    "medida" "public"."medida_tratamiento",
    "tipo" "text",
    "comision_porcentaje" numeric(5,2) DEFAULT 0.00,
    "activo" boolean DEFAULT true,
    "fecha_registro" timestamp with time zone DEFAULT "now"()
);


--
-- Name: recetas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."recetas" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "caso_id" "uuid" NOT NULL,
    "cita_id" "uuid",
    "paciente_id" "uuid" NOT NULL,
    "prescriptor_id" "uuid" NOT NULL,
    "contenido" "text" NOT NULL,
    "fecha" timestamp with time zone DEFAULT "now"(),
    "pdf_url" "text"
);


--
-- Name: seguimiento_imagenes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."seguimiento_imagenes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "seguimiento_id" "uuid",
    "ruta" "text" NOT NULL,
    "descripcion" "text",
    "uploaded_at" timestamp with time zone DEFAULT "now"(),
    "caso_id" "uuid",
    "public_id" "text",
    "titulo" "text",
    "tipo" "text" DEFAULT 'general'::"text",
    "fecha_captura" "date",
    "url" "text",
    CONSTRAINT "check_parent_reference" CHECK ((("seguimiento_id" IS NOT NULL) OR ("caso_id" IS NOT NULL))),
    CONSTRAINT "chk_imagen_vinculo" CHECK ((("seguimiento_id" IS NOT NULL) OR ("caso_id" IS NOT NULL)))
);


--
-- Name: COLUMN "seguimiento_imagenes"."caso_id"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."seguimiento_imagenes"."caso_id" IS 'ID del caso clínico al que pertenece la imagen (opcional)';


--
-- Name: COLUMN "seguimiento_imagenes"."tipo"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."seguimiento_imagenes"."tipo" IS 'Tipo de imagen: antes, durante, despues, radiografia, general';


--
-- Name: seguimientos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."seguimientos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "paciente_id" "uuid" NOT NULL,
    "odontologo_id" "uuid" NOT NULL,
    "cita_id" "uuid",
    "fecha_seguimiento" "date" DEFAULT CURRENT_DATE NOT NULL,
    "procedimiento_id" "uuid",
    "observaciones" "text",
    "fecha_proxima_cita" "date",
    "caso_id" "uuid"
);


--
-- Name: transacciones_financieras; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."transacciones_financieras" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "cita_id" "uuid",
    "monto" numeric(10,2) NOT NULL,
    "moneda_id" "uuid" NOT NULL,
    "tipo" "text" NOT NULL,
    "descripcion" "text",
    "fecha_transaccion" timestamp with time zone DEFAULT "now"()
);


--
-- Name: unidades; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."unidades" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "nombre" "text" NOT NULL
);


--
-- Name: vista_citas_costo; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW "public"."vista_citas_costo" AS
 SELECT "c"."id",
    (("pac"."nombres" || ' '::"text") || "pac"."apellidos") AS "paciente",
    "per"."nombre_completo" AS "odontologo",
    "c"."fecha_inicio",
    "c"."costo_total",
    "m"."simbolo" AS "simbolo_moneda",
    "c"."estado"
   FROM ((("public"."citas" "c"
     LEFT JOIN "public"."pacientes" "pac" ON (("c"."paciente_id" = "pac"."id")))
     LEFT JOIN "public"."personal" "per" ON (("c"."odontologo_id" = "per"."id")))
     LEFT JOIN "public"."monedas" "m" ON (("c"."moneda_id" = "m"."id")));


--
-- Name: vista_planes_costo; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW "public"."vista_planes_costo" AS
 SELECT "p"."id",
    "p"."nombre",
    (("pac"."nombres" || ' '::"text") || "pac"."apellidos") AS "paciente",
    "p"."costo_total",
    "m"."simbolo" AS "simbolo_moneda",
    "p"."estado",
    "count"("pi"."id") AS "total_items",
    "p"."fecha_creacion"
   FROM ((("public"."planes_procedimiento" "p"
     LEFT JOIN "public"."pacientes" "pac" ON (("p"."paciente_id" = "pac"."id")))
     LEFT JOIN "public"."monedas" "m" ON (("p"."moneda_id" = "m"."id")))
     LEFT JOIN "public"."plan_items" "pi" ON (("p"."id" = "pi"."plan_id")))
  GROUP BY "p"."id", "p"."nombre", "pac"."nombres", "pac"."apellidos", "p"."costo_total", "m"."simbolo", "p"."estado", "p"."fecha_creacion";


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."buckets" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "owner" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "public" boolean DEFAULT false,
    "avif_autodetection" boolean DEFAULT false,
    "file_size_limit" bigint,
    "allowed_mime_types" "text"[],
    "owner_id" "text",
    "type" "storage"."buckettype" DEFAULT 'STANDARD'::"storage"."buckettype" NOT NULL
);


--
-- Name: COLUMN "buckets"."owner"; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN "storage"."buckets"."owner" IS 'Field is deprecated, use owner_id instead';


--
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."buckets_analytics" (
    "name" "text" NOT NULL,
    "type" "storage"."buckettype" DEFAULT 'ANALYTICS'::"storage"."buckettype" NOT NULL,
    "format" "text" DEFAULT 'ICEBERG'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "deleted_at" timestamp with time zone
);


--
-- Name: buckets_vectors; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."buckets_vectors" (
    "id" "text" NOT NULL,
    "type" "storage"."buckettype" DEFAULT 'VECTOR'::"storage"."buckettype" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."migrations" (
    "id" integer NOT NULL,
    "name" character varying(100) NOT NULL,
    "hash" character varying(40) NOT NULL,
    "executed_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: objects; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."objects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "bucket_id" "text",
    "name" "text",
    "owner" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "last_accessed_at" timestamp with time zone DEFAULT "now"(),
    "metadata" "jsonb",
    "path_tokens" "text"[] GENERATED ALWAYS AS ("string_to_array"("name", '/'::"text")) STORED,
    "version" "text",
    "owner_id" "text",
    "user_metadata" "jsonb",
    "level" integer
);


--
-- Name: COLUMN "objects"."owner"; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN "storage"."objects"."owner" IS 'Field is deprecated, use owner_id instead';


--
-- Name: prefixes; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."prefixes" (
    "bucket_id" "text" NOT NULL,
    "name" "text" NOT NULL COLLATE "pg_catalog"."C",
    "level" integer GENERATED ALWAYS AS ("storage"."get_level"("name")) STORED NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."s3_multipart_uploads" (
    "id" "text" NOT NULL,
    "in_progress_size" bigint DEFAULT 0 NOT NULL,
    "upload_signature" "text" NOT NULL,
    "bucket_id" "text" NOT NULL,
    "key" "text" NOT NULL COLLATE "pg_catalog"."C",
    "version" "text" NOT NULL,
    "owner_id" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_metadata" "jsonb"
);


--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."s3_multipart_uploads_parts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "upload_id" "text" NOT NULL,
    "size" bigint DEFAULT 0 NOT NULL,
    "part_number" integer NOT NULL,
    "bucket_id" "text" NOT NULL,
    "key" "text" NOT NULL COLLATE "pg_catalog"."C",
    "etag" "text" NOT NULL,
    "owner_id" "text",
    "version" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


--
-- Name: vector_indexes; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."vector_indexes" (
    "id" "text" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL COLLATE "pg_catalog"."C",
    "bucket_id" "text" NOT NULL,
    "data_type" "text" NOT NULL,
    "dimension" integer NOT NULL,
    "distance_metric" "text" NOT NULL,
    "metadata_configuration" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."refresh_tokens" ALTER COLUMN "id" SET DEFAULT "nextval"('"auth"."refresh_tokens_id_seq"'::"regclass");


--
-- Name: cie10_catalogo id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."cie10_catalogo" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."cie10_catalogo_id_seq"'::"regclass");


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") FROM stdin;
00000000-0000-0000-0000-000000000000	4ea51222-2841-499f-be03-8f37a09ca020	{"action":"user_confirmation_requested","actor_id":"31ec8fab-61ed-4394-b3d0-4595526208b7","actor_username":"danilo26122003@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-09-07 22:40:10.480798+00	
00000000-0000-0000-0000-000000000000	068f7193-a255-44b0-9478-5713444f718a	{"action":"user_signedup","actor_id":"31ec8fab-61ed-4394-b3d0-4595526208b7","actor_username":"danilo26122003@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-09-07 22:40:42.19181+00	
00000000-0000-0000-0000-000000000000	32b54673-343e-471f-8563-c77ba8f45532	{"action":"login","actor_id":"31ec8fab-61ed-4394-b3d0-4595526208b7","actor_username":"danilo26122003@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-07 22:40:47.312025+00	
00000000-0000-0000-0000-000000000000	f757c078-283a-4026-9972-0ab378f25b72	{"action":"login","actor_id":"31ec8fab-61ed-4394-b3d0-4595526208b7","actor_username":"danilo26122003@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"email"}}	2025-09-07 22:40:47.50359+00	
00000000-0000-0000-0000-000000000000	88f85d1e-b095-4afb-b8c2-6b6478dd4bc8	{"action":"user_confirmation_requested","actor_id":"cbe231b9-7260-459b-b71f-5399fe725219","actor_username":"tapion1123@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-09-08 13:05:16.660075+00	
00000000-0000-0000-0000-000000000000	8a12586d-656d-4334-9c1d-c901c6a26644	{"action":"user_signedup","actor_id":"cbe231b9-7260-459b-b71f-5399fe725219","actor_username":"tapion1123@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-09-08 13:05:38.428781+00	
00000000-0000-0000-0000-000000000000	ce2fd924-62df-4509-9cd4-d6d7e85a044a	{"action":"login","actor_id":"cbe231b9-7260-459b-b71f-5399fe725219","actor_username":"tapion1123@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-08 13:05:51.380273+00	
00000000-0000-0000-0000-000000000000	b6a957f4-890f-4d08-97f3-0cf9a7690a56	{"action":"login","actor_id":"cbe231b9-7260-459b-b71f-5399fe725219","actor_username":"tapion1123@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"email"}}	2025-09-08 13:05:51.426756+00	
00000000-0000-0000-0000-000000000000	c9b8852c-3102-4d23-8ccf-56843622c119	{"action":"login","actor_id":"cbe231b9-7260-459b-b71f-5399fe725219","actor_username":"tapion1123@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-08 13:48:46.426625+00	
00000000-0000-0000-0000-000000000000	c10d4866-495a-4f18-9353-1899e0e8e40d	{"action":"token_refreshed","actor_id":"31ec8fab-61ed-4394-b3d0-4595526208b7","actor_username":"danilo26122003@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-08 14:45:36.498468+00	
00000000-0000-0000-0000-000000000000	d18f613f-5b4e-41b1-a5ab-b5e6af8a33b6	{"action":"token_revoked","actor_id":"31ec8fab-61ed-4394-b3d0-4595526208b7","actor_username":"danilo26122003@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-08 14:45:36.514331+00	
00000000-0000-0000-0000-000000000000	5078f196-0cb5-4820-b4fd-4541f2be4fda	{"action":"token_refreshed","actor_id":"31ec8fab-61ed-4394-b3d0-4595526208b7","actor_username":"danilo26122003@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-08 14:45:46.211355+00	
00000000-0000-0000-0000-000000000000	b7caf0f6-7032-439d-b36d-b6d672c368ab	{"action":"logout","actor_id":"31ec8fab-61ed-4394-b3d0-4595526208b7","actor_username":"danilo26122003@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-08 14:45:53.454761+00	
00000000-0000-0000-0000-000000000000	1432e47e-43a6-4fcf-9662-2d2f4d77b67c	{"action":"token_refreshed","actor_id":"cbe231b9-7260-459b-b71f-5399fe725219","actor_username":"tapion1123@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-08 14:48:07.302249+00	
00000000-0000-0000-0000-000000000000	8077b325-3926-4b1f-975d-6a3a3c6283d5	{"action":"token_revoked","actor_id":"cbe231b9-7260-459b-b71f-5399fe725219","actor_username":"tapion1123@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-08 14:48:07.30358+00	
00000000-0000-0000-0000-000000000000	96e42cc7-185d-4392-8417-cef23c9665f9	{"action":"token_refreshed","actor_id":"cbe231b9-7260-459b-b71f-5399fe725219","actor_username":"tapion1123@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-08 14:48:07.331818+00	
00000000-0000-0000-0000-000000000000	73747295-be77-481a-867d-1f56f8cc8fbc	{"action":"token_refreshed","actor_id":"cbe231b9-7260-459b-b71f-5399fe725219","actor_username":"tapion1123@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-08 15:46:54.64411+00	
00000000-0000-0000-0000-000000000000	ec2557d7-9360-420f-91bc-495af3f14a52	{"action":"token_revoked","actor_id":"cbe231b9-7260-459b-b71f-5399fe725219","actor_username":"tapion1123@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-08 15:46:54.660759+00	
00000000-0000-0000-0000-000000000000	3832ca9d-5557-4880-bd01-f3c897789448	{"action":"user_confirmation_requested","actor_id":"51bb9297-1e61-4ab7-988b-d8f2eef5c015","actor_username":"80212614@dental.company","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-09-08 16:23:33.428369+00	
00000000-0000-0000-0000-000000000000	b1eede51-e59d-40d4-b9ec-94452d598114	{"action":"user_confirmation_requested","actor_id":"fc3f9937-ee2b-4cc6-b683-9da07919edc4","actor_username":"odontologo2@dental.company","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-09-08 16:26:43.458467+00	
00000000-0000-0000-0000-000000000000	97c739b3-3dff-4f58-855c-664a05cce2c3	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"80212614@dental.company","user_id":"51bb9297-1e61-4ab7-988b-d8f2eef5c015","user_phone":""}}	2025-09-08 16:32:16.489541+00	
00000000-0000-0000-0000-000000000000	cd696ccb-c6fa-46dd-800e-dc1449da3491	{"action":"user_signedup","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-09-08 16:32:56.474759+00	
00000000-0000-0000-0000-000000000000	79be4e7e-c519-4a75-a89f-a029a2d1d97c	{"action":"login","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-08 16:32:56.489086+00	
00000000-0000-0000-0000-000000000000	95cc46ac-5432-4d7d-ab61-66bade59d7f4	{"action":"login","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-08 16:35:14.376751+00	
00000000-0000-0000-0000-000000000000	43e53245-728a-49a3-914e-2ea73bb5af6f	{"action":"token_refreshed","actor_id":"cbe231b9-7260-459b-b71f-5399fe725219","actor_username":"tapion1123@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-08 16:45:15.389745+00	
00000000-0000-0000-0000-000000000000	07f8f3bd-1a01-4d17-a224-dd73b6963bf7	{"action":"token_revoked","actor_id":"cbe231b9-7260-459b-b71f-5399fe725219","actor_username":"tapion1123@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-08 16:45:15.395193+00	
00000000-0000-0000-0000-000000000000	438ebcdc-c872-44b8-99ff-647b45571be0	{"action":"login","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-08 17:20:20.226798+00	
00000000-0000-0000-0000-000000000000	977b9478-1a48-4ff1-88ce-b1989ecc1f7d	{"action":"login","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-08 17:23:03.237992+00	
00000000-0000-0000-0000-000000000000	83ca7d07-9b86-489e-830c-beba450f8c76	{"action":"user_signedup","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-09-08 17:27:56.20548+00	
00000000-0000-0000-0000-000000000000	86b6ea32-59f9-4755-a358-63adec923f3e	{"action":"login","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-08 17:27:56.216449+00	
00000000-0000-0000-0000-000000000000	b15e9b96-982c-47d7-b4d3-2b9bdf9ced28	{"action":"login","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-08 17:28:04.001845+00	
00000000-0000-0000-0000-000000000000	67909d5b-91dc-4435-a89f-11ab2036e53c	{"action":"login","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-08 17:33:07.206747+00	
00000000-0000-0000-0000-000000000000	a659f21a-31bc-4239-a2a2-f0ea556ba0da	{"action":"user_signedup","actor_id":"482031d1-1a76-46b2-afa6-2cb569b219c5","actor_username":"ulises@dental.company","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-09-08 17:34:30.976872+00	
00000000-0000-0000-0000-000000000000	01a058a0-0f51-453e-bfaa-f48bfbc64891	{"action":"login","actor_id":"482031d1-1a76-46b2-afa6-2cb569b219c5","actor_username":"ulises@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-08 17:34:30.980948+00	
00000000-0000-0000-0000-000000000000	766ba9fb-afe4-4f02-84c9-65e655919652	{"action":"login","actor_id":"482031d1-1a76-46b2-afa6-2cb569b219c5","actor_username":"ulises@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-08 17:34:36.483913+00	
00000000-0000-0000-0000-000000000000	d4756f55-18af-401e-b87c-639877850f88	{"action":"token_refreshed","actor_id":"cbe231b9-7260-459b-b71f-5399fe725219","actor_username":"tapion1123@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-08 19:43:05.036217+00	
00000000-0000-0000-0000-000000000000	8f929632-2dad-4b2a-a46a-15c73b0a10ac	{"action":"token_revoked","actor_id":"cbe231b9-7260-459b-b71f-5399fe725219","actor_username":"tapion1123@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-08 19:43:05.05693+00	
00000000-0000-0000-0000-000000000000	90a48721-3b6f-4300-9c8b-251822aa91a2	{"action":"login","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-08 22:40:57.040429+00	
00000000-0000-0000-0000-000000000000	a74c9b37-4133-49a5-82cf-961e337a5bdb	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-09 12:50:00.576945+00	
00000000-0000-0000-0000-000000000000	503887e2-f22b-4a28-bd6c-a9749bd5b63e	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-09 12:50:00.588925+00	
00000000-0000-0000-0000-000000000000	3c88c9d1-abfb-483b-9a7a-04cde3ef3aba	{"action":"logout","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account"}	2025-09-09 13:04:16.944691+00	
00000000-0000-0000-0000-000000000000	1a40ea8d-3244-4495-834c-79b3eaf75daf	{"action":"login","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-09 13:05:07.66086+00	
00000000-0000-0000-0000-000000000000	b756d15a-f0b9-476a-b5db-fd987a3e06db	{"action":"logout","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account"}	2025-09-09 13:17:37.024956+00	
00000000-0000-0000-0000-000000000000	07d4cca2-09eb-4e5d-a1de-150557cda411	{"action":"login","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-09 13:17:39.556788+00	
00000000-0000-0000-0000-000000000000	6d41b70f-346f-41fb-af89-d49d13cc8f5a	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-09 14:18:12.220273+00	
00000000-0000-0000-0000-000000000000	ed3e7cc3-dc9f-45e5-846a-8c6d97b9dcf4	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-09 14:18:12.229044+00	
00000000-0000-0000-0000-000000000000	ed7ad482-6894-4a66-9d37-669344f88ffc	{"action":"token_refreshed","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-09 19:01:18.159269+00	
00000000-0000-0000-0000-000000000000	fc59a275-1e22-4adc-a6a4-d4de3e2dbae2	{"action":"token_revoked","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-09 19:01:18.169771+00	
00000000-0000-0000-0000-000000000000	71ff5392-9404-4a0d-8785-b18d39d00b29	{"action":"token_refreshed","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-09 19:15:14.822166+00	
00000000-0000-0000-0000-000000000000	db05db51-8caa-46f4-8474-2f157886f078	{"action":"token_revoked","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-09 19:15:14.828269+00	
00000000-0000-0000-0000-000000000000	86b5d89f-ecba-40d5-adcc-a4929571806d	{"action":"login","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-09 19:15:30.263108+00	
00000000-0000-0000-0000-000000000000	0c04ad0c-76ea-4d4c-95ea-db633ded9e3a	{"action":"token_refreshed","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-09 20:21:12.39709+00	
00000000-0000-0000-0000-000000000000	5766637b-a08c-4a24-af45-a0b019f72ece	{"action":"token_revoked","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-09 20:21:12.420534+00	
00000000-0000-0000-0000-000000000000	98cc9868-b20b-489f-88ed-537eaf857069	{"action":"token_refreshed","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-09 20:31:53.815984+00	
00000000-0000-0000-0000-000000000000	30c6e302-00fd-409a-b4c6-2dfed6f2440c	{"action":"token_revoked","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-09 20:31:53.825665+00	
00000000-0000-0000-0000-000000000000	f9d1eb73-e6b1-4810-bb9f-6347a71a9d90	{"action":"logout","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"account"}	2025-09-09 20:39:21.932835+00	
00000000-0000-0000-0000-000000000000	2027c086-cfb8-4aa7-8f0b-f41bc31f6f8e	{"action":"token_refreshed","actor_id":"cbe231b9-7260-459b-b71f-5399fe725219","actor_username":"tapion1123@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-09 21:07:43.465494+00	
00000000-0000-0000-0000-000000000000	ef99fb5b-abff-49ed-af15-e3b4a4d58ad5	{"action":"token_revoked","actor_id":"cbe231b9-7260-459b-b71f-5399fe725219","actor_username":"tapion1123@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-09 21:07:43.47664+00	
00000000-0000-0000-0000-000000000000	548f1453-e6e5-4f2c-848c-a1583baead25	{"action":"login","actor_id":"cbe231b9-7260-459b-b71f-5399fe725219","actor_username":"tapion1123@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-09 21:08:39.057765+00	
00000000-0000-0000-0000-000000000000	2e93a551-bd32-4118-b5ee-4a44bfd21c39	{"action":"token_refreshed","actor_id":"cbe231b9-7260-459b-b71f-5399fe725219","actor_username":"tapion1123@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-09 22:07:26.215178+00	
00000000-0000-0000-0000-000000000000	755b2aa6-685e-4e8c-9a14-fb628e6e1c56	{"action":"token_revoked","actor_id":"cbe231b9-7260-459b-b71f-5399fe725219","actor_username":"tapion1123@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-09 22:07:26.239672+00	
00000000-0000-0000-0000-000000000000	6dd8748a-eeaa-44e2-bc98-3072eb850102	{"action":"token_refreshed","actor_id":"cbe231b9-7260-459b-b71f-5399fe725219","actor_username":"tapion1123@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-09 23:11:30.317867+00	
00000000-0000-0000-0000-000000000000	45f93890-0304-433c-ad2e-b8ae7bc5a640	{"action":"token_revoked","actor_id":"cbe231b9-7260-459b-b71f-5399fe725219","actor_username":"tapion1123@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-09 23:11:30.333318+00	
00000000-0000-0000-0000-000000000000	d8f0b49d-46c9-47e8-a225-fe1ac7f1e854	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-10 01:44:59.111322+00	
00000000-0000-0000-0000-000000000000	8e27de3a-229a-4e63-9a72-d805cf275115	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-10 01:44:59.124737+00	
00000000-0000-0000-0000-000000000000	5fb77611-8649-4683-a79e-d9f78186e90e	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-10 01:45:10.673175+00	
00000000-0000-0000-0000-000000000000	3bbe7199-a732-4d78-a367-b64e9890d508	{"action":"login","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-10 03:14:17.666818+00	
00000000-0000-0000-0000-000000000000	23bc618b-0b16-4c8a-b21b-229bfba8f8e6	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-10 03:15:01.864813+00	
00000000-0000-0000-0000-000000000000	6cdaf52e-fdbe-4e05-bec6-54cec85269d1	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-10 03:15:01.872463+00	
00000000-0000-0000-0000-000000000000	c202c902-e287-4d62-ba19-bca4829415be	{"action":"logout","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"account"}	2025-09-10 03:17:17.265132+00	
00000000-0000-0000-0000-000000000000	8fc74b07-8c70-4296-8d8c-4fdf5fe4f292	{"action":"token_refreshed","actor_id":"cbe231b9-7260-459b-b71f-5399fe725219","actor_username":"tapion1123@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-10 03:31:48.544487+00	
00000000-0000-0000-0000-000000000000	a1e301f0-6eff-43ac-a27f-3cc923066737	{"action":"token_revoked","actor_id":"cbe231b9-7260-459b-b71f-5399fe725219","actor_username":"tapion1123@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-10 03:31:48.552851+00	
00000000-0000-0000-0000-000000000000	7d8944ae-2d98-4ade-a4c6-f777baf9edb7	{"action":"token_refreshed","actor_id":"cbe231b9-7260-459b-b71f-5399fe725219","actor_username":"tapion1123@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-10 12:37:30.431867+00	
00000000-0000-0000-0000-000000000000	a5e55162-31b8-4019-b0bb-a98becda9997	{"action":"token_revoked","actor_id":"cbe231b9-7260-459b-b71f-5399fe725219","actor_username":"tapion1123@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-10 12:37:30.460957+00	
00000000-0000-0000-0000-000000000000	e5dd7eac-d090-42b5-af3b-60511d7c481e	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-10 12:56:26.077691+00	
00000000-0000-0000-0000-000000000000	ad55d973-d85c-4df3-8b27-582b34a4dc77	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-10 12:56:26.089227+00	
00000000-0000-0000-0000-000000000000	bc20b583-620b-4da6-b02a-472982997db5	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-10 13:55:57.801225+00	
00000000-0000-0000-0000-000000000000	00f3cf01-768d-4c57-8865-4eb8c027c2e7	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-10 13:55:57.813008+00	
00000000-0000-0000-0000-000000000000	3c880ea4-dd86-48a4-802e-eee85dbd3e78	{"action":"token_refreshed","actor_id":"cbe231b9-7260-459b-b71f-5399fe725219","actor_username":"tapion1123@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-10 14:22:38.039736+00	
00000000-0000-0000-0000-000000000000	03f84e91-ab76-461d-ab42-9bbe4670303b	{"action":"token_revoked","actor_id":"cbe231b9-7260-459b-b71f-5399fe725219","actor_username":"tapion1123@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-10 14:22:38.048323+00	
00000000-0000-0000-0000-000000000000	b1fcf284-1ff6-4811-8960-e0a4c6604c15	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-10 14:56:44.710191+00	
00000000-0000-0000-0000-000000000000	19651281-b32d-4410-91af-d3d8f824d8d5	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-10 14:56:44.743252+00	
00000000-0000-0000-0000-000000000000	780ad2de-9aad-4c4d-b143-3dcaced93dec	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-10 16:39:25.459187+00	
00000000-0000-0000-0000-000000000000	34f73141-b50b-4c18-99da-9ea8539bb8eb	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-10 16:39:25.468665+00	
00000000-0000-0000-0000-000000000000	8963c6c7-6fb8-47a8-a816-d075d68f7257	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-10 17:38:02.365091+00	
00000000-0000-0000-0000-000000000000	dcd7dfae-9ff1-47d8-9569-7b29b9462879	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-10 17:38:02.377121+00	
00000000-0000-0000-0000-000000000000	5dc7d38d-a5a9-4cb5-bdc0-f90bc210ebf2	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-11 00:53:35.105347+00	
00000000-0000-0000-0000-000000000000	bb949c40-8169-4723-a716-fdeb88fd0946	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-11 00:53:35.132205+00	
00000000-0000-0000-0000-000000000000	3584d03d-f64f-43f5-a829-5e3611d98b6f	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-11 00:53:42.918476+00	
00000000-0000-0000-0000-000000000000	bf0e2b97-a91a-4366-b882-66a2c20ef40f	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-11 13:20:20.914227+00	
00000000-0000-0000-0000-000000000000	37250bce-6116-4f85-9881-a0c5161317a1	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-11 13:20:20.940009+00	
00000000-0000-0000-0000-000000000000	1dccb3ab-abf1-479f-90e1-a9c7508bf966	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-11 13:20:25.637379+00	
00000000-0000-0000-0000-000000000000	5f6a71f6-0f16-48c3-af40-42595e58f14f	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-11 14:29:03.975613+00	
00000000-0000-0000-0000-000000000000	1598006e-7f7b-4416-8810-1909e2540b75	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-11 14:29:03.992057+00	
00000000-0000-0000-0000-000000000000	26f0e0b9-b907-4f40-ac0a-1669a44bb9bd	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-11 20:21:53.186693+00	
00000000-0000-0000-0000-000000000000	b0614521-9f85-4566-9c27-392d6c844d9d	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-11 20:21:53.207406+00	
00000000-0000-0000-0000-000000000000	57fd5db9-e3aa-4652-8081-cf5bf77fc6ee	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-11 20:22:02.58376+00	
00000000-0000-0000-0000-000000000000	ecde03ab-92f0-4066-bc7f-0046820fa373	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-12 13:50:48.15303+00	
00000000-0000-0000-0000-000000000000	a49ebd96-4777-4881-b6ae-c54e08f157b7	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-12 13:50:48.183045+00	
00000000-0000-0000-0000-000000000000	58739a10-96cd-4587-8838-06263353123b	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-12 14:49:55.608549+00	
00000000-0000-0000-0000-000000000000	a62565cd-a816-44f0-8b77-24c44534e761	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-12 14:49:55.635179+00	
00000000-0000-0000-0000-000000000000	43b553fd-d32c-45b0-8b2f-29576dd8c483	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-12 15:56:25.466339+00	
00000000-0000-0000-0000-000000000000	0c7d8be9-398b-42f0-95cb-347ab8769003	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-12 15:56:25.490477+00	
00000000-0000-0000-0000-000000000000	825fbf9a-39c4-4206-8575-ae860074cef3	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-14 02:18:41.58901+00	
00000000-0000-0000-0000-000000000000	1c5ee348-e899-4fab-82e6-cc1d93a02d03	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-14 02:18:41.619607+00	
00000000-0000-0000-0000-000000000000	c87f44ec-4fb6-4aac-ad79-4521c0caa213	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-14 21:04:52.117723+00	
00000000-0000-0000-0000-000000000000	eb5fd21a-841b-4bf9-82e5-8cc6caaf9962	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-14 21:04:52.141131+00	
00000000-0000-0000-0000-000000000000	28b0c766-c587-4211-a2f4-5945b981b334	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-14 21:04:52.212297+00	
00000000-0000-0000-0000-000000000000	ca366ace-8692-4145-84c6-0bb8f2fc26b9	{"action":"logout","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account"}	2025-09-14 21:06:31.625959+00	
00000000-0000-0000-0000-000000000000	8fcea3bd-d5cd-4b93-a363-22e3ffc461e3	{"action":"login","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-14 21:06:34.862948+00	
00000000-0000-0000-0000-000000000000	e08ad489-a6fe-4f18-b809-1137dd55f609	{"action":"user_signedup","actor_id":"cddeb628-0403-4946-9a2e-c786fc5482fe","actor_username":"odontologo4@hotmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-09-14 21:26:39.69488+00	
00000000-0000-0000-0000-000000000000	5085fc49-04a9-4656-bed8-8b2629d5df68	{"action":"login","actor_id":"cddeb628-0403-4946-9a2e-c786fc5482fe","actor_username":"odontologo4@hotmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-14 21:26:39.706795+00	
00000000-0000-0000-0000-000000000000	cad8e1e9-4064-4c61-aab4-a6cee7d3f96d	{"action":"login","actor_id":"cddeb628-0403-4946-9a2e-c786fc5482fe","actor_username":"odontologo4@hotmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-14 21:26:50.877026+00	
00000000-0000-0000-0000-000000000000	565b5d89-d63d-44fa-a0dc-ab2c4597946d	{"action":"login","actor_id":"cddeb628-0403-4946-9a2e-c786fc5482fe","actor_username":"odontologo4@hotmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-14 21:26:52.745307+00	
00000000-0000-0000-0000-000000000000	bd7b1ca7-4eca-4ffe-a768-4d807184cb4f	{"action":"login","actor_id":"cddeb628-0403-4946-9a2e-c786fc5482fe","actor_username":"odontologo4@hotmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-14 21:26:53.943016+00	
00000000-0000-0000-0000-000000000000	976a4d69-61d7-4af1-b034-d0abdb67d157	{"action":"login","actor_id":"cddeb628-0403-4946-9a2e-c786fc5482fe","actor_username":"odontologo4@hotmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-14 21:26:55.336607+00	
00000000-0000-0000-0000-000000000000	daa7ed68-d8b6-4246-b5fa-177ac87a05e4	{"action":"login","actor_id":"cddeb628-0403-4946-9a2e-c786fc5482fe","actor_username":"odontologo4@hotmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-14 21:26:56.977883+00	
00000000-0000-0000-0000-000000000000	3a57fe30-b746-4d10-835f-cf72f4869256	{"action":"login","actor_id":"cddeb628-0403-4946-9a2e-c786fc5482fe","actor_username":"odontologo4@hotmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-14 21:27:00.530066+00	
00000000-0000-0000-0000-000000000000	29be6680-c78d-4767-9022-a31e1db20b5c	{"action":"login","actor_id":"cddeb628-0403-4946-9a2e-c786fc5482fe","actor_username":"odontologo4@hotmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-14 21:27:57.944109+00	
00000000-0000-0000-0000-000000000000	5d57805e-9747-4e74-9bc6-ab9ab27ec1e2	{"action":"login","actor_id":"cddeb628-0403-4946-9a2e-c786fc5482fe","actor_username":"odontologo4@hotmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-14 21:27:59.213039+00	
00000000-0000-0000-0000-000000000000	0526e046-ea8d-42b6-83f1-857800a4d418	{"action":"login","actor_id":"cddeb628-0403-4946-9a2e-c786fc5482fe","actor_username":"odontologo4@hotmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-14 21:28:00.913864+00	
00000000-0000-0000-0000-000000000000	86e56a7a-9dc7-4854-b732-0863366cadf8	{"action":"login","actor_id":"cddeb628-0403-4946-9a2e-c786fc5482fe","actor_username":"odontologo4@hotmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-14 21:28:02.706534+00	
00000000-0000-0000-0000-000000000000	80d701f1-5291-40bd-8c7c-29d585f282e6	{"action":"login","actor_id":"cddeb628-0403-4946-9a2e-c786fc5482fe","actor_username":"odontologo4@hotmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-14 21:28:09.944942+00	
00000000-0000-0000-0000-000000000000	b5f5dbf8-715d-4b71-b463-7c3288e1323c	{"action":"login","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-14 21:29:31.142294+00	
00000000-0000-0000-0000-000000000000	66418bcb-2203-4cbb-b73e-3439288769d9	{"action":"login","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-14 21:29:33.683934+00	
00000000-0000-0000-0000-000000000000	f562a8b0-9789-4635-9ebd-6bb31cf743a9	{"action":"login","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-14 21:29:35.444275+00	
00000000-0000-0000-0000-000000000000	80b6c6e3-c563-4e9b-a50f-0b614436f7cb	{"action":"user_signedup","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-09-14 21:31:09.235856+00	
00000000-0000-0000-0000-000000000000	20ff66a3-9b94-49be-a6a5-f865bb40f676	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-14 21:31:09.240679+00	
00000000-0000-0000-0000-000000000000	f708546b-57e5-43f1-a691-7407a8ecde5e	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-14 21:31:12.177533+00	
00000000-0000-0000-0000-000000000000	f00de59c-8cd0-4202-990d-f14018a1b4b5	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-14 21:31:13.43881+00	
00000000-0000-0000-0000-000000000000	a405da3a-a55a-42f8-a1f3-9b5826a436de	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-14 21:31:14.088069+00	
00000000-0000-0000-0000-000000000000	fb7c77b0-2fa7-40e1-8d5f-bf888e75837e	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-14 21:31:14.454541+00	
00000000-0000-0000-0000-000000000000	d85e018d-cb17-40e0-97c6-134cfefbe1bb	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-14 21:31:14.80317+00	
00000000-0000-0000-0000-000000000000	048fb476-7e42-4026-904f-338c85633953	{"action":"login","actor_id":"cddeb628-0403-4946-9a2e-c786fc5482fe","actor_username":"odontologo4@hotmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-14 21:32:43.954291+00	
00000000-0000-0000-0000-000000000000	e6394f15-cd24-4750-aaaa-e89c9eb2349c	{"action":"login","actor_id":"cddeb628-0403-4946-9a2e-c786fc5482fe","actor_username":"odontologo4@hotmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-14 21:33:07.79489+00	
00000000-0000-0000-0000-000000000000	7b884a2a-04bd-4eee-84df-0bca8b44e526	{"action":"user_recovery_requested","actor_id":"482031d1-1a76-46b2-afa6-2cb569b219c5","actor_username":"ulises@dental.company","actor_via_sso":false,"log_type":"user"}	2025-09-14 21:33:26.338921+00	
00000000-0000-0000-0000-000000000000	773c88a0-a141-4bab-97c3-bdf3007e7298	{"action":"login","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-14 21:34:10.836116+00	
00000000-0000-0000-0000-000000000000	5438c460-a91c-465b-a4bf-1deec9112598	{"action":"logout","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account"}	2025-09-14 21:34:34.566778+00	
00000000-0000-0000-0000-000000000000	1bda7024-d1c8-49bb-a432-e61b7d5ca3de	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-14 21:34:36.444264+00	
00000000-0000-0000-0000-000000000000	be706b66-558d-4a8e-90e1-8adeab7d4e0c	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-14 21:34:38.229329+00	
00000000-0000-0000-0000-000000000000	716ad566-110d-49e3-bf39-65bbd5d20094	{"action":"login","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-14 21:45:26.913664+00	
00000000-0000-0000-0000-000000000000	25a8f322-8803-4282-9df3-32b8634ddefd	{"action":"login","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-14 21:45:27.835733+00	
00000000-0000-0000-0000-000000000000	b1fb2e54-4c4e-45eb-a0eb-edac86a725ec	{"action":"login","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-14 21:45:28.901003+00	
00000000-0000-0000-0000-000000000000	66aade74-928a-4475-9df1-1037fe5dd1db	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-14 22:44:03.998947+00	
00000000-0000-0000-0000-000000000000	37fc7120-8773-4826-8bc6-c4d870d7d765	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-14 22:44:04.034643+00	
00000000-0000-0000-0000-000000000000	8931c3a6-0cd7-4069-9dc1-f8fb06479ab7	{"action":"token_refreshed","actor_id":"cbe231b9-7260-459b-b71f-5399fe725219","actor_username":"tapion1123@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-14 23:22:54.928992+00	
00000000-0000-0000-0000-000000000000	cf3e8a33-f83f-4fb9-b9f6-009acb4a9a08	{"action":"token_revoked","actor_id":"cbe231b9-7260-459b-b71f-5399fe725219","actor_username":"tapion1123@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-14 23:22:54.951575+00	
00000000-0000-0000-0000-000000000000	2e7c5517-cf84-4244-8bd3-3b09171052e5	{"action":"token_refreshed","actor_id":"cbe231b9-7260-459b-b71f-5399fe725219","actor_username":"tapion1123@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-14 23:23:15.887066+00	
00000000-0000-0000-0000-000000000000	63bb81e2-09ae-4276-9675-d5a7f59fc266	{"action":"token_refreshed","actor_id":"cbe231b9-7260-459b-b71f-5399fe725219","actor_username":"tapion1123@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-15 00:27:26.810816+00	
00000000-0000-0000-0000-000000000000	f228aa1e-c64e-4373-a5ac-7441c4334dca	{"action":"token_revoked","actor_id":"cbe231b9-7260-459b-b71f-5399fe725219","actor_username":"tapion1123@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-15 00:27:26.832207+00	
00000000-0000-0000-0000-000000000000	5917cf14-52bb-48cd-b64a-f5ee227be3d2	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-15 13:53:35.096794+00	
00000000-0000-0000-0000-000000000000	0e611035-e349-47d3-b49a-a52b3cf289aa	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-15 13:53:35.128372+00	
00000000-0000-0000-0000-000000000000	9db07399-5a6c-482c-931d-d6075251a280	{"action":"login","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-15 14:15:43.833308+00	
00000000-0000-0000-0000-000000000000	10d267c6-b8a6-459f-9667-0038e27c442c	{"action":"logout","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account"}	2025-09-15 14:44:45.583956+00	
00000000-0000-0000-0000-000000000000	f27a046f-0040-4566-aba8-3b8421340747	{"action":"login","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-15 14:45:47.693002+00	
00000000-0000-0000-0000-000000000000	1af9c000-86aa-4198-a840-e43bf5e87700	{"action":"login","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-15 14:45:48.655716+00	
00000000-0000-0000-0000-000000000000	fa7f2544-1c14-4ef4-ad48-0422941039a9	{"action":"logout","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account"}	2025-09-15 14:48:48.046556+00	
00000000-0000-0000-0000-000000000000	2f9b2d41-ea2f-4455-8aec-8b2076cca3ee	{"action":"login","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-15 15:08:11.381293+00	
00000000-0000-0000-0000-000000000000	f1adff08-da0d-4c9e-b270-f8c7b65c1c95	{"action":"logout","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account"}	2025-09-15 15:15:24.305651+00	
00000000-0000-0000-0000-000000000000	8c18be49-dd80-4768-930d-e1784bad7b8c	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-15 15:19:18.165522+00	
00000000-0000-0000-0000-000000000000	383b00e2-f75e-4c89-a64e-5f7b69867b72	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-15 15:19:18.172198+00	
00000000-0000-0000-0000-000000000000	09897967-b517-4487-8d62-02359c56035f	{"action":"logout","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account"}	2025-09-15 15:19:31.792052+00	
00000000-0000-0000-0000-000000000000	11c27120-1d0d-4665-8278-10b5b5134b9d	{"action":"token_refreshed","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-15 15:28:41.69837+00	
00000000-0000-0000-0000-000000000000	54c4acff-2954-495e-8a95-c04e1932fe5c	{"action":"token_revoked","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-15 15:28:41.708639+00	
00000000-0000-0000-0000-000000000000	ad93ee87-b5d6-407d-92de-cff777e9ad6e	{"action":"login","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-15 15:32:46.746389+00	
00000000-0000-0000-0000-000000000000	e9f8315a-3e38-49c4-ba1d-080bb562ef8f	{"action":"login","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-15 15:41:24.750013+00	
00000000-0000-0000-0000-000000000000	73438114-168c-47ca-9ae4-f2c96696a002	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-15 15:49:27.078458+00	
00000000-0000-0000-0000-000000000000	9797a675-a491-4a19-a577-ff13241e1b40	{"action":"token_refreshed","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-15 16:28:41.521428+00	
00000000-0000-0000-0000-000000000000	f3dbf0cb-f276-4964-8485-afaa2be47124	{"action":"token_revoked","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-15 16:28:41.545527+00	
00000000-0000-0000-0000-000000000000	448a0b83-fd59-496e-a91f-69159194d73d	{"action":"user_signedup","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-09-15 16:56:21.111549+00	
00000000-0000-0000-0000-000000000000	d091e624-edae-40d7-ba15-b8cbcf571a76	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-15 16:56:21.126644+00	
00000000-0000-0000-0000-000000000000	8924e3da-5d64-4cca-8783-b1b2e990309b	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-15 16:56:27.773657+00	
00000000-0000-0000-0000-000000000000	7ee91b2c-3f45-42d7-927f-3df1908e7c90	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-15 17:06:11.974364+00	
00000000-0000-0000-0000-000000000000	005bc615-b21f-4006-8c00-93112fcc5f28	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-15 17:06:11.982218+00	
00000000-0000-0000-0000-000000000000	85ce0f68-018c-4052-ad1b-74694c851fd1	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-15 17:11:01.841245+00	
00000000-0000-0000-0000-000000000000	bc253bf4-827b-42d7-88f7-7632a22b63a2	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-15 17:13:55.735482+00	
00000000-0000-0000-0000-000000000000	77141db7-87f5-49f0-a552-faec92ec9e00	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-15 17:13:55.739116+00	
00000000-0000-0000-0000-000000000000	50d2246b-6669-4973-80c1-d66b42fcc7c3	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-15 17:14:02.989656+00	
00000000-0000-0000-0000-000000000000	a7bb55f0-b636-4721-bb76-644e5dcab6e1	{"action":"logout","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account"}	2025-09-15 17:22:55.379233+00	
00000000-0000-0000-0000-000000000000	3fcab6dd-73f5-4dd2-8f8b-04a8cb86f16f	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-15 17:24:43.622195+00	
00000000-0000-0000-0000-000000000000	5e6cb9c3-52c0-41a1-a66c-3f9f7353462f	{"action":"login","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-15 17:25:17.418835+00	
00000000-0000-0000-0000-000000000000	600ec7c2-0547-4a11-bc7c-6101c1d3c718	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-15 19:30:26.673198+00	
00000000-0000-0000-0000-000000000000	564111e6-56a2-40f2-b70b-814dff62ab3a	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-15 19:30:26.703745+00	
00000000-0000-0000-0000-000000000000	b6b8bb1b-0c00-4aab-a64f-d9342c7ea177	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-15 21:01:51.443445+00	
00000000-0000-0000-0000-000000000000	3aee1dd8-0e53-47bd-9945-25957a57ba59	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-15 21:01:51.464876+00	
00000000-0000-0000-0000-000000000000	f71b99f4-f231-4dd8-ba82-529ab3c47bf3	{"action":"token_refreshed","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-15 21:24:04.155483+00	
00000000-0000-0000-0000-000000000000	483bf17f-8f35-4d03-be1b-73e6fe2558c9	{"action":"token_revoked","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-15 21:24:04.165233+00	
00000000-0000-0000-0000-000000000000	e9b87ea7-c5c0-43b3-8c81-7efc486e7b94	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-16 13:54:02.396783+00	
00000000-0000-0000-0000-000000000000	933cdf6b-0f40-4070-b518-89bfb8409fdc	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-16 13:54:02.422558+00	
00000000-0000-0000-0000-000000000000	18dbf5ca-b919-48c2-b13c-8e5995a390bc	{"action":"logout","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account"}	2025-09-16 13:54:25.659698+00	
00000000-0000-0000-0000-000000000000	0da6230a-075a-4141-9033-3430b6450af8	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-16 13:54:28.777664+00	
00000000-0000-0000-0000-000000000000	75b21596-0bf4-49d4-a2dc-e615e6d6f257	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-16 13:58:02.86783+00	
00000000-0000-0000-0000-000000000000	3e394f55-a6da-40f9-976f-602c5372a15f	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-16 13:58:02.869857+00	
00000000-0000-0000-0000-000000000000	5eade37d-492b-4634-8294-b37cb74f14d5	{"action":"logout","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account"}	2025-09-16 13:58:25.956267+00	
00000000-0000-0000-0000-000000000000	6c558b0a-ca98-4de4-a225-d23238c27f27	{"action":"login","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-16 13:58:28.861004+00	
00000000-0000-0000-0000-000000000000	1b74e535-277b-45e9-bece-d403cd74bdeb	{"action":"token_refreshed","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-16 14:00:12.603408+00	
00000000-0000-0000-0000-000000000000	72ae917d-627b-435c-996e-d6c01c7fd96c	{"action":"token_revoked","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-16 14:00:12.604539+00	
00000000-0000-0000-0000-000000000000	a8bd8679-eeb3-4cc2-9e9a-fb2463339a0e	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-16 14:57:57.493567+00	
00000000-0000-0000-0000-000000000000	adf719f3-1f98-42a8-a1b1-3cb609e47932	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-16 14:57:57.516985+00	
00000000-0000-0000-0000-000000000000	4c3a003b-6aa2-4943-920d-b3c48ab51467	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-16 15:07:57.9783+00	
00000000-0000-0000-0000-000000000000	eec088a9-0062-48a8-95d8-11b4bdc07858	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-16 15:07:57.989316+00	
00000000-0000-0000-0000-000000000000	76d4a6cc-63bc-4898-b718-c1dd777deefd	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-16 15:08:02.042554+00	
00000000-0000-0000-0000-000000000000	053e5b43-1c9c-41d3-b47a-90760824e40c	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-16 15:41:27.203078+00	
00000000-0000-0000-0000-000000000000	2ec670a1-a7a6-4cf8-bde0-98fc5ba6c2b4	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-16 21:50:05.406311+00	
00000000-0000-0000-0000-000000000000	61d41fe3-046a-4b04-817d-a039fbcc2d70	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-16 21:50:05.418087+00	
00000000-0000-0000-0000-000000000000	963893c7-dfec-48e7-a31e-df4ddd8443d1	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-17 15:28:06.17223+00	
00000000-0000-0000-0000-000000000000	9cd1c5aa-c055-4f1e-af07-0c06847211a5	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-17 15:28:06.20151+00	
00000000-0000-0000-0000-000000000000	65a437c2-7fdc-4b67-b975-a13d1809a039	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-17 21:00:46.035723+00	
00000000-0000-0000-0000-000000000000	280e0c21-03b5-450d-a4ad-477535decf59	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-17 21:00:46.059524+00	
00000000-0000-0000-0000-000000000000	29cc920b-f020-40aa-a46a-cb503f5e9ef0	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-18 03:27:02.821306+00	
00000000-0000-0000-0000-000000000000	92b4798b-dec1-4fad-977b-459eeb0eed01	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-18 03:27:02.836847+00	
00000000-0000-0000-0000-000000000000	ea5353e0-3932-4fa8-8f6b-c4ad0574e8ba	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-18 05:11:51.654861+00	
00000000-0000-0000-0000-000000000000	997a2661-3522-4658-ba28-800235c8f961	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-18 05:11:51.670133+00	
00000000-0000-0000-0000-000000000000	2a923086-0bb1-47e4-ab2b-8c8291ef1127	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-20 15:44:35.498802+00	
00000000-0000-0000-0000-000000000000	f317e0ab-39db-4c4e-9718-52b84fa28cdf	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-20 16:43:08.908049+00	
00000000-0000-0000-0000-000000000000	ebafa67c-4908-446c-8f11-fad93976caba	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-20 16:43:08.928047+00	
00000000-0000-0000-0000-000000000000	e5196fe7-e511-4271-a0db-3e01dc957191	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-20 17:43:39.834253+00	
00000000-0000-0000-0000-000000000000	c6c58f31-e9e4-4630-82d4-c230923c12a3	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-20 17:43:39.85626+00	
00000000-0000-0000-0000-000000000000	33d03650-5ca9-450f-87e6-2e44c5f06a8b	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-20 18:22:48.448218+00	
00000000-0000-0000-0000-000000000000	dab9eb72-9697-43a2-839b-2a15eb1febd3	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-20 18:29:03.087489+00	
00000000-0000-0000-0000-000000000000	6370d32a-9e05-4bd4-a723-d4114c1f361e	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-20 19:18:28.297906+00	
00000000-0000-0000-0000-000000000000	999110bc-4b2c-4471-82f5-f1bc9a09340f	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-20 20:07:37.224387+00	
00000000-0000-0000-0000-000000000000	b136bcd5-835d-4671-abdd-2c40ce0927d1	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-20 20:14:16.395092+00	
00000000-0000-0000-0000-000000000000	9f29d9cd-c5c6-4d0e-9cb9-407d43732129	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-20 21:08:20.628459+00	
00000000-0000-0000-0000-000000000000	d5735dc4-6273-4478-921b-aef3206e6b6e	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-20 22:06:29.574807+00	
00000000-0000-0000-0000-000000000000	f7ace0c7-1a64-4f15-b4ed-a563147d9757	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-20 23:32:04.380962+00	
00000000-0000-0000-0000-000000000000	07641d0a-2e01-4519-85f7-91075b27e103	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-20 23:32:04.39076+00	
00000000-0000-0000-0000-000000000000	dcf2f5de-42e3-4ef8-9d8c-60cf0530120a	{"action":"token_refreshed","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-21 00:03:12.253571+00	
00000000-0000-0000-0000-000000000000	e7810f55-4efc-48b2-9531-9a08798a23c4	{"action":"token_revoked","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-21 00:03:12.271099+00	
00000000-0000-0000-0000-000000000000	aeb28160-e4ee-4081-a796-2a88f26f0949	{"action":"token_refreshed","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-21 01:03:24.521723+00	
00000000-0000-0000-0000-000000000000	82c22228-4f45-4a7a-b06a-8a06214d6acb	{"action":"token_revoked","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-21 01:03:24.544044+00	
00000000-0000-0000-0000-000000000000	873d8028-ac40-4683-9b98-49894425ee71	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-21 13:04:43.332906+00	
00000000-0000-0000-0000-000000000000	2d3f4b02-32ab-458a-a8f7-9c012f1f6077	{"action":"logout","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account"}	2025-09-21 13:05:02.041617+00	
00000000-0000-0000-0000-000000000000	e10afacb-531b-4689-9972-2216750b893f	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 13:05:09.924565+00	
00000000-0000-0000-0000-000000000000	31e60f09-69f1-40ef-af9d-17b0e359821d	{"action":"logout","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account"}	2025-09-21 13:06:13.713839+00	
00000000-0000-0000-0000-000000000000	a1a4b13e-1bbf-4684-a5d3-ebeaeec66320	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-22 01:40:13.280209+00	
00000000-0000-0000-0000-000000000000	7e2b9611-8ed4-49f5-a6f9-8653a774b5c8	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-22 01:40:13.303904+00	
00000000-0000-0000-0000-000000000000	d6d03352-f8d2-4038-af61-ae4c90ec0e6e	{"action":"logout","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account"}	2025-09-22 01:40:44.607579+00	
00000000-0000-0000-0000-000000000000	18fdb957-8cea-4b72-aca0-e1a4e976cbac	{"action":"login","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-22 01:40:47.445386+00	
00000000-0000-0000-0000-000000000000	957dbc8c-35fc-40cc-8116-a83c3bc3aa08	{"action":"logout","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account"}	2025-09-22 01:41:16.839976+00	
00000000-0000-0000-0000-000000000000	5f8bb779-3958-45c4-bb8d-f4dc8dac2530	{"action":"login","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-22 01:41:18.51425+00	
00000000-0000-0000-0000-000000000000	a41df8dd-f606-47de-bac1-96d2e993d0e0	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-22 02:48:39.712685+00	
00000000-0000-0000-0000-000000000000	e07035c4-9f7f-44d2-8d56-7427855236d1	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-22 02:48:39.729609+00	
00000000-0000-0000-0000-000000000000	74a2e2e9-7aa0-48b7-b6c0-afd7f547e006	{"action":"logout","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account"}	2025-09-22 02:48:55.156323+00	
00000000-0000-0000-0000-000000000000	b0d567fc-e9e3-48c5-acea-9fb412d001a3	{"action":"login","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-22 02:48:57.362668+00	
00000000-0000-0000-0000-000000000000	06005781-d19c-48c0-badb-3c02de54a592	{"action":"token_refreshed","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-22 02:57:31.577094+00	
00000000-0000-0000-0000-000000000000	69ba7daf-0855-4917-a7cd-2f58e5f8eb46	{"action":"token_revoked","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-22 02:57:31.592644+00	
00000000-0000-0000-0000-000000000000	4f30176c-d797-4d36-9ca5-2d5d17a6906b	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-22 03:58:54.34566+00	
00000000-0000-0000-0000-000000000000	6c4b39f0-b166-4041-9102-7498225b9efa	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-22 03:58:54.368769+00	
00000000-0000-0000-0000-000000000000	ac6ca1a0-11eb-42ec-bd2b-e66df158c7aa	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-22 04:59:23.448631+00	
00000000-0000-0000-0000-000000000000	b514ad0f-2554-4d34-b54c-b7bf5f0b7be5	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-22 04:59:23.482921+00	
00000000-0000-0000-0000-000000000000	967399e4-316e-485c-9093-4206fcf2dada	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-22 12:27:09.020527+00	
00000000-0000-0000-0000-000000000000	ae176bce-34d4-47bd-910b-65c220e4921b	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-22 12:27:09.037792+00	
00000000-0000-0000-0000-000000000000	680b2ecd-ceab-44f2-91d1-72f16ed0b424	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-22 12:27:10.741892+00	
00000000-0000-0000-0000-000000000000	0ddd7d4e-30f4-45cf-ba99-256566a57b7c	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-22 13:48:50.532713+00	
00000000-0000-0000-0000-000000000000	1eae1576-94e9-477b-a469-ecd02e4bd92a	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-22 13:48:50.560516+00	
00000000-0000-0000-0000-000000000000	e26579d0-67b5-4439-9169-d607187c78ac	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-22 14:54:48.079033+00	
00000000-0000-0000-0000-000000000000	2bfa0194-3fbb-49db-a48c-b38d315a0b82	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-22 14:54:48.098323+00	
00000000-0000-0000-0000-000000000000	4f83770c-7bc2-4370-8023-7daa67fe431a	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-22 15:55:44.283584+00	
00000000-0000-0000-0000-000000000000	bdb23280-369c-4528-a152-bab135b8335a	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-22 15:55:44.315671+00	
00000000-0000-0000-0000-000000000000	40191309-892f-463a-8ade-9ece749b64e0	{"action":"token_refreshed","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-22 15:56:43.30637+00	
00000000-0000-0000-0000-000000000000	2512c438-ee24-462c-bce5-ef83b5dc2d45	{"action":"token_revoked","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-22 15:56:43.307324+00	
00000000-0000-0000-0000-000000000000	889da7de-8299-4552-9998-339995c3fda1	{"action":"logout","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"account"}	2025-09-22 16:08:31.458315+00	
00000000-0000-0000-0000-000000000000	d3d05b78-19fc-44f6-b30c-981349df9c37	{"action":"user_signedup","actor_id":"141b2519-daf3-4bf8-8dac-e97840181403","actor_username":"test_personal@dental.company","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-09-22 16:08:53.366249+00	
00000000-0000-0000-0000-000000000000	e3657161-0e97-48a1-b8d6-440bc7b87c0e	{"action":"login","actor_id":"141b2519-daf3-4bf8-8dac-e97840181403","actor_username":"test_personal@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-22 16:08:53.378524+00	
00000000-0000-0000-0000-000000000000	cad85b72-9db2-4947-a4fc-411347e95c11	{"action":"login","actor_id":"141b2519-daf3-4bf8-8dac-e97840181403","actor_username":"test_personal@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-22 16:09:04.068098+00	
00000000-0000-0000-0000-000000000000	29553575-12ba-49b6-b049-8862f596d99f	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-22 16:59:59.679537+00	
00000000-0000-0000-0000-000000000000	8c1d9fb2-ef4b-4f37-93bf-61ba4c048dc1	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-22 16:59:59.708137+00	
00000000-0000-0000-0000-000000000000	0268c5f5-5068-4318-932d-14a6df52665e	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-22 18:23:25.286665+00	
00000000-0000-0000-0000-000000000000	181c6856-14bf-47e4-a0d0-f31a3431ddda	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-22 18:23:25.319561+00	
00000000-0000-0000-0000-000000000000	9e2898e3-996f-44cd-a2f3-2016919ae680	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-22 19:26:42.751846+00	
00000000-0000-0000-0000-000000000000	d37d91cd-6253-4a68-8f8a-9505d1da921d	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-22 19:26:42.769404+00	
00000000-0000-0000-0000-000000000000	76cba796-e5a7-470b-b42e-dd617ded2820	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-23 12:58:28.943291+00	
00000000-0000-0000-0000-000000000000	30a27dea-c45c-436f-b64a-b62ec3f28f82	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-23 12:58:28.965235+00	
00000000-0000-0000-0000-000000000000	819b627d-ad8f-43fe-b58d-f10d9e0f8a43	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-23 13:57:11.118364+00	
00000000-0000-0000-0000-000000000000	b6b04a00-6b9d-4ab3-bd49-b0bfc0802612	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-23 13:57:11.136962+00	
00000000-0000-0000-0000-000000000000	f0fe3138-7133-4cc6-86e4-780d8d07c67d	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-23 15:27:54.863944+00	
00000000-0000-0000-0000-000000000000	1dc38e41-4c2d-4ec2-87d1-9c7922b06e4c	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-23 15:27:54.885607+00	
00000000-0000-0000-0000-000000000000	b7881305-0a87-40e7-8d2f-58e3098cbbcc	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-23 16:30:18.830558+00	
00000000-0000-0000-0000-000000000000	3531a86b-122e-4945-934e-b0401265525d	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-23 16:30:18.862857+00	
00000000-0000-0000-0000-000000000000	732e510e-36c3-49fb-8b96-add919ec6d5c	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-23 17:48:04.927414+00	
00000000-0000-0000-0000-000000000000	6eb896d2-9d32-4557-a3c4-69ac034823bc	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-23 17:48:04.945208+00	
00000000-0000-0000-0000-000000000000	f2cb30e3-cef0-4d7b-a099-7ababbdd63d2	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-24 12:24:42.319731+00	
00000000-0000-0000-0000-000000000000	10b8be1a-6a7a-4698-b742-3e8489cdd159	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-24 12:24:42.343501+00	
00000000-0000-0000-0000-000000000000	7907a11c-a655-441e-b93b-8c92153f1024	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-24 13:26:33.617158+00	
00000000-0000-0000-0000-000000000000	333582f6-8eaa-46c6-bbca-a3366f2e3572	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-24 13:26:33.644811+00	
00000000-0000-0000-0000-000000000000	792cde72-1186-4ae5-a399-8f91f15c1725	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-24 14:26:43.275786+00	
00000000-0000-0000-0000-000000000000	55cba966-d9ad-47aa-9f9e-8632e31e4932	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-24 14:26:43.302399+00	
00000000-0000-0000-0000-000000000000	c5d6f3b6-4b65-4766-817b-a6bb382ae4f4	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-24 15:25:14.307144+00	
00000000-0000-0000-0000-000000000000	d318b0d3-f7ed-42a9-b99f-99c55ec8021e	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-24 15:25:14.335324+00	
00000000-0000-0000-0000-000000000000	bf22085e-d698-49e1-93eb-3910384c6610	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-24 15:25:14.402817+00	
00000000-0000-0000-0000-000000000000	095d2eea-2f17-4fb0-8f7a-b9cf7999c138	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-24 15:25:14.517689+00	
00000000-0000-0000-0000-000000000000	5c49b12f-3af1-44b9-8dd3-3572ccab3cde	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-24 15:25:14.607929+00	
00000000-0000-0000-0000-000000000000	6523f541-939b-41ee-80b9-99e8cfb8782e	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-24 15:25:14.695044+00	
00000000-0000-0000-0000-000000000000	be2bd688-4750-4194-b8c5-2ecc34431191	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-24 15:25:14.913645+00	
00000000-0000-0000-0000-000000000000	f2c182e5-e7f6-43ca-a95a-a580727faee8	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-24 15:25:15.125252+00	
00000000-0000-0000-0000-000000000000	2a627a55-a9f0-4294-b60c-ff66fa25edb1	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-24 15:25:15.268429+00	
00000000-0000-0000-0000-000000000000	6f3ff03e-7f76-45df-bb06-14cedf106de7	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-24 15:25:15.312944+00	
00000000-0000-0000-0000-000000000000	2c66d0bc-ce3d-4aca-9984-dbcc0a56b6db	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-24 15:25:15.489559+00	
00000000-0000-0000-0000-000000000000	bb2f042c-ba4f-445a-b791-8a954ecfe900	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-24 15:25:15.554729+00	
00000000-0000-0000-0000-000000000000	bdd4e48a-f301-4377-a34c-8bbfd2a7202c	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-24 15:25:15.663208+00	
00000000-0000-0000-0000-000000000000	3c647619-7a6a-49a5-9904-6a89fdd0235c	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-24 15:25:15.955665+00	
00000000-0000-0000-0000-000000000000	1270d888-d674-41f0-b00e-54d4296687fb	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-24 15:25:16.027336+00	
00000000-0000-0000-0000-000000000000	c45376cd-2165-4b83-8877-24995dc3f866	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-24 15:25:16.139983+00	
00000000-0000-0000-0000-000000000000	17f1cd45-e032-418a-9a59-178d46cc878b	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-24 15:25:16.309437+00	
00000000-0000-0000-0000-000000000000	8d1a0abb-b801-41f2-9b73-f0646df73ca9	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-24 15:25:16.410233+00	
00000000-0000-0000-0000-000000000000	77dda498-e418-40b7-a4b2-7fc27f01202b	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-24 15:25:16.457762+00	
00000000-0000-0000-0000-000000000000	ee5e2092-1b43-476e-ad69-4d8d204db635	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-24 15:25:16.675062+00	
00000000-0000-0000-0000-000000000000	7174a8d6-5300-40fe-8156-3a62956b33ef	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-24 15:25:16.773593+00	
00000000-0000-0000-0000-000000000000	9e708efb-f9bb-47f2-906e-242a50b5f1c1	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-24 15:25:16.845175+00	
00000000-0000-0000-0000-000000000000	28d62ed3-1c40-470a-a91f-3300436a246b	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-24 15:25:17.043087+00	
00000000-0000-0000-0000-000000000000	3a5bbcc3-9f81-4797-9235-0f443891c4dc	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-24 15:25:17.162565+00	
00000000-0000-0000-0000-000000000000	13e34f27-00dc-4dcb-a6aa-cb1fcbfdbdab	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-24 15:49:18.727434+00	
00000000-0000-0000-0000-000000000000	16d992b8-e0a4-444f-80d6-7570663aa311	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-24 15:49:18.737944+00	
00000000-0000-0000-0000-000000000000	f1f2f9c9-9de3-4765-85fb-cfb6a57e2ed9	{"action":"token_refreshed","actor_id":"141b2519-daf3-4bf8-8dac-e97840181403","actor_username":"test_personal@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-24 15:50:08.034695+00	
00000000-0000-0000-0000-000000000000	719f829c-25a9-40f3-8943-7323849ded45	{"action":"token_revoked","actor_id":"141b2519-daf3-4bf8-8dac-e97840181403","actor_username":"test_personal@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-24 15:50:08.035483+00	
00000000-0000-0000-0000-000000000000	8a6ab0f6-3400-4580-b999-1f8a57f466d0	{"action":"token_refreshed","actor_id":"141b2519-daf3-4bf8-8dac-e97840181403","actor_username":"test_personal@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-24 16:49:01.378113+00	
00000000-0000-0000-0000-000000000000	d310e433-e990-4b1f-8cf4-5ff0c1538182	{"action":"token_revoked","actor_id":"141b2519-daf3-4bf8-8dac-e97840181403","actor_username":"test_personal@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-24 16:49:01.413102+00	
00000000-0000-0000-0000-000000000000	5b176932-16f6-4da4-ae52-6427ad20ade2	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-24 19:41:11.641329+00	
00000000-0000-0000-0000-000000000000	825b93d7-eb2d-45ab-b5ac-eb5782d5b7b3	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-24 19:41:11.669938+00	
00000000-0000-0000-0000-000000000000	d745f432-0e1a-46f6-8ab5-10d228605630	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-24 19:41:11.736992+00	
00000000-0000-0000-0000-000000000000	2420ece7-3685-46d1-9135-471851e983d5	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-26 13:26:36.121669+00	
00000000-0000-0000-0000-000000000000	a4becbaf-c899-4964-ad4f-93fc1a92c686	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-26 13:26:36.144738+00	
00000000-0000-0000-0000-000000000000	50483b40-2c28-4e9d-9e1b-e02b72954226	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-26 18:10:44.268046+00	
00000000-0000-0000-0000-000000000000	cb27a8ab-fabc-4bb7-8898-78e12a5a9222	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-26 18:10:44.29102+00	
00000000-0000-0000-0000-000000000000	b914738f-3513-441b-8430-6ade35bc8331	{"action":"logout","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account"}	2025-09-26 18:32:02.506512+00	
00000000-0000-0000-0000-000000000000	f544540f-e96f-4810-b8a5-12a7ef9cd64c	{"action":"login","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-26 18:33:49.549415+00	
00000000-0000-0000-0000-000000000000	91df589d-12f3-4f12-9855-edd0997ffd3e	{"action":"login","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-26 18:41:58.798979+00	
00000000-0000-0000-0000-000000000000	eca91112-83af-40e2-95e9-7f71e6fe5812	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-26 18:55:06.191792+00	
00000000-0000-0000-0000-000000000000	fd22aca1-8990-4636-9dc6-c2097050c9f9	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-26 18:55:08.826068+00	
00000000-0000-0000-0000-000000000000	1c903c1d-a211-4aa1-b6d7-d3adf86306f6	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-29 12:28:21.130264+00	
00000000-0000-0000-0000-000000000000	18361436-3524-4e77-a3d4-959f2373cebd	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-29 12:28:21.157175+00	
00000000-0000-0000-0000-000000000000	c1b0875d-24b3-4e9d-9d6d-ceb3f698c61f	{"action":"logout","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account"}	2025-09-29 12:28:31.542212+00	
00000000-0000-0000-0000-000000000000	0666db53-a534-4cf6-90d7-cc585e767ebd	{"action":"login","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-29 12:28:35.170969+00	
00000000-0000-0000-0000-000000000000	907be2be-e4af-4ef6-8d23-01902cf3b4c0	{"action":"logout","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account"}	2025-09-29 12:38:08.251676+00	
00000000-0000-0000-0000-000000000000	bbc5281a-6da1-4f4f-b150-160166d22cb2	{"action":"login","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-29 12:38:11.133761+00	
00000000-0000-0000-0000-000000000000	82c1f3ae-9768-4f32-a92a-ea0260c36021	{"action":"login","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-29 12:38:37.99942+00	
00000000-0000-0000-0000-000000000000	fe80c9ec-32e0-457c-aeef-6dc5427012a8	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-29 13:44:52.955146+00	
00000000-0000-0000-0000-000000000000	6c4f6f77-c9b3-4586-8c88-196d9497e7e8	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-29 13:44:52.978169+00	
00000000-0000-0000-0000-000000000000	5a6039f4-d19b-4eba-a6e6-5e273a2f2b1a	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-29 13:44:53.037712+00	
00000000-0000-0000-0000-000000000000	dc049c35-d5e5-417f-9ea5-45b4eecfb7ca	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-29 14:50:11.062905+00	
00000000-0000-0000-0000-000000000000	0315a735-2470-489b-80e5-63e59570784f	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-29 14:50:11.089584+00	
00000000-0000-0000-0000-000000000000	3df20041-daf6-468a-9301-3616ea1de894	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-29 15:54:05.749228+00	
00000000-0000-0000-0000-000000000000	8290e4e8-6460-4478-aa3f-6ca57397ada8	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-29 15:54:05.780565+00	
00000000-0000-0000-0000-000000000000	ec58990e-3069-45cc-a846-d988530ee34b	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-29 15:56:22.831284+00	
00000000-0000-0000-0000-000000000000	f930f2c1-7497-4412-81f8-4fee2b5102aa	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-29 16:11:09.136639+00	
00000000-0000-0000-0000-000000000000	201f203f-a250-436b-8425-ba1c8aae169a	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-29 17:16:20.047768+00	
00000000-0000-0000-0000-000000000000	70bba726-416d-4a13-b7aa-6b54d120c92b	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-29 17:16:20.072918+00	
00000000-0000-0000-0000-000000000000	b8565df7-9c09-4985-ac2a-7c2efa9fd816	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-29 17:16:20.097199+00	
00000000-0000-0000-0000-000000000000	8d690a4e-700a-4b33-b7a1-e1df3c1a518f	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-29 17:23:41.205336+00	
00000000-0000-0000-0000-000000000000	d7caef93-92b7-418b-983b-45b876209298	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-29 17:23:41.216641+00	
00000000-0000-0000-0000-000000000000	4f5b4c8e-3bee-48b2-94ba-42e9ecb1f12e	{"action":"token_refreshed","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-29 17:24:38.841023+00	
00000000-0000-0000-0000-000000000000	f00030ee-7144-43ca-ac7f-c19f87965378	{"action":"token_revoked","actor_id":"c955e2b0-07b0-455f-8ae5-acd9919fdde2","actor_username":"odontologo4@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-29 17:24:38.843863+00	
00000000-0000-0000-0000-000000000000	c1d0710c-6d43-45b1-9fe4-7d546fad1c2c	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-29 17:45:22.94813+00	
00000000-0000-0000-0000-000000000000	8678e9aa-8f4b-4ad2-bd3e-d87a0329e3b7	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-29 18:17:16.533185+00	
00000000-0000-0000-0000-000000000000	a55c9bb2-c930-425f-85f2-9c879c6250c2	{"action":"user_signedup","actor_id":"6c806f28-8135-4406-8a4e-e7a8c5fdadec","actor_username":"sergioco@dental.company","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-09-29 18:20:31.775031+00	
00000000-0000-0000-0000-000000000000	07f4cf73-e1ea-4c81-87fb-64811da1e0cd	{"action":"login","actor_id":"6c806f28-8135-4406-8a4e-e7a8c5fdadec","actor_username":"sergioco@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-29 18:20:31.784141+00	
00000000-0000-0000-0000-000000000000	71b03cc3-a3cb-4dae-8d32-b18ccae26388	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-29 22:48:09.131903+00	
00000000-0000-0000-0000-000000000000	f27c0164-8fd8-4029-80a2-ed47939ea9ba	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-29 22:48:09.149865+00	
00000000-0000-0000-0000-000000000000	9712d63e-1173-4df7-b4d7-72f4050736a2	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-29 23:51:55.95267+00	
00000000-0000-0000-0000-000000000000	fe5b0ccd-d2ae-450a-bb46-cc230ba198bc	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-29 23:51:55.970186+00	
00000000-0000-0000-0000-000000000000	81df17b3-3c05-4bc3-b221-78aa54163923	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-29 23:54:30.543877+00	
00000000-0000-0000-0000-000000000000	cabf2b80-48dd-478c-b349-f51172873dbf	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-30 03:51:35.532649+00	
00000000-0000-0000-0000-000000000000	1273bd1f-8eea-4cc3-83df-3634a3bd6edc	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-30 03:51:35.549304+00	
00000000-0000-0000-0000-000000000000	7f6ed3ed-e088-45d5-a218-200d65552f84	{"action":"logout","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account"}	2025-09-30 03:51:44.777776+00	
00000000-0000-0000-0000-000000000000	d6cd2eb4-d04a-4502-bcea-e3b79c6c160d	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-30 03:51:47.295669+00	
00000000-0000-0000-0000-000000000000	922b88de-546c-4ffe-bc79-5c69db738e26	{"action":"token_refreshed","actor_id":"6c806f28-8135-4406-8a4e-e7a8c5fdadec","actor_username":"sergioco@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-30 12:27:44.807557+00	
00000000-0000-0000-0000-000000000000	89832292-dc43-460a-8068-09c2f23e6da1	{"action":"token_revoked","actor_id":"6c806f28-8135-4406-8a4e-e7a8c5fdadec","actor_username":"sergioco@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-30 12:27:44.832089+00	
00000000-0000-0000-0000-000000000000	500a4934-5b07-40a3-8807-1223a3d6e15c	{"action":"token_refreshed","actor_id":"6c806f28-8135-4406-8a4e-e7a8c5fdadec","actor_username":"sergioco@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-30 12:27:49.021297+00	
00000000-0000-0000-0000-000000000000	1e8c6923-e5df-468a-82a3-52ca01fe5d87	{"action":"token_refreshed","actor_id":"6c806f28-8135-4406-8a4e-e7a8c5fdadec","actor_username":"sergioco@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-30 13:34:19.284358+00	
00000000-0000-0000-0000-000000000000	d6057d0e-5a4a-42a6-97d3-53f92476952a	{"action":"token_revoked","actor_id":"6c806f28-8135-4406-8a4e-e7a8c5fdadec","actor_username":"sergioco@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-30 13:34:19.310253+00	
00000000-0000-0000-0000-000000000000	98dd2965-25a0-452d-a77e-4a1072540e4b	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-30 14:21:36.503513+00	
00000000-0000-0000-0000-000000000000	761d3239-76fa-4e2d-bedd-c595385926ff	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-30 14:21:36.543049+00	
00000000-0000-0000-0000-000000000000	0c5670a9-2392-42c5-b976-b64ddb62b160	{"action":"token_refreshed","actor_id":"6c806f28-8135-4406-8a4e-e7a8c5fdadec","actor_username":"sergioco@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-30 14:45:47.217077+00	
00000000-0000-0000-0000-000000000000	5968a082-c249-447a-8811-8a80d11efe8e	{"action":"token_revoked","actor_id":"6c806f28-8135-4406-8a4e-e7a8c5fdadec","actor_username":"sergioco@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-30 14:45:47.252341+00	
00000000-0000-0000-0000-000000000000	548b54df-e8e6-46f8-8e93-8bb9dde2d9ed	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-30 15:38:17.01607+00	
00000000-0000-0000-0000-000000000000	ebad8f6d-d6a0-436b-8414-dbb12ec75fbb	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-30 15:38:17.044383+00	
00000000-0000-0000-0000-000000000000	0d04539e-b77a-4ea3-94f0-c1f818a7b0dd	{"action":"token_refreshed","actor_id":"6c806f28-8135-4406-8a4e-e7a8c5fdadec","actor_username":"sergioco@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-30 15:45:39.598783+00	
00000000-0000-0000-0000-000000000000	11a29360-e0bb-4ee2-872a-f913e177a5c3	{"action":"token_revoked","actor_id":"6c806f28-8135-4406-8a4e-e7a8c5fdadec","actor_username":"sergioco@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-30 15:45:39.613462+00	
00000000-0000-0000-0000-000000000000	107fa406-239c-4628-b140-dd0eba341801	{"action":"token_refreshed","actor_id":"6c806f28-8135-4406-8a4e-e7a8c5fdadec","actor_username":"sergioco@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-30 16:44:51.216527+00	
00000000-0000-0000-0000-000000000000	36b1144a-83bc-46ad-b7f3-367aa4614f0b	{"action":"token_revoked","actor_id":"6c806f28-8135-4406-8a4e-e7a8c5fdadec","actor_username":"sergioco@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-30 16:44:51.246056+00	
00000000-0000-0000-0000-000000000000	3c71fe42-70af-4169-8cb3-b24f028498ea	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-30 17:03:00.22717+00	
00000000-0000-0000-0000-000000000000	bedda1e7-0d91-4725-81c2-2519bb863788	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-30 17:03:00.23257+00	
00000000-0000-0000-0000-000000000000	9c066b4e-611e-4e7d-92a1-6ac03094f2ad	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-30 17:29:58.756232+00	
00000000-0000-0000-0000-000000000000	f67a55c0-f255-483e-b722-454b529d287c	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-30 17:29:58.77148+00	
00000000-0000-0000-0000-000000000000	4b52e0fb-4583-479e-9f76-438c003c2112	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-30 17:30:08.538617+00	
00000000-0000-0000-0000-000000000000	2fdcf2a7-a864-4631-bee7-5a649927ad88	{"action":"token_refreshed","actor_id":"6c806f28-8135-4406-8a4e-e7a8c5fdadec","actor_username":"sergioco@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-30 17:44:31.449191+00	
00000000-0000-0000-0000-000000000000	97efbb56-cc5f-4c8a-815a-996d3c2af2b5	{"action":"token_revoked","actor_id":"6c806f28-8135-4406-8a4e-e7a8c5fdadec","actor_username":"sergioco@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-30 17:44:31.461629+00	
00000000-0000-0000-0000-000000000000	b594097a-0865-4d17-b637-78b4f48865ca	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-30 18:13:33.748194+00	
00000000-0000-0000-0000-000000000000	8cab90ac-1ec7-4d6f-8363-36feb616ab5c	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-30 18:13:33.774073+00	
00000000-0000-0000-0000-000000000000	5901fcde-23a8-474c-a0d7-7194117172e1	{"action":"token_refreshed","actor_id":"6c806f28-8135-4406-8a4e-e7a8c5fdadec","actor_username":"sergioco@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-30 21:39:47.177281+00	
00000000-0000-0000-0000-000000000000	316cf91f-2062-40eb-9f7b-9efffabd848c	{"action":"token_revoked","actor_id":"6c806f28-8135-4406-8a4e-e7a8c5fdadec","actor_username":"sergioco@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-30 21:39:47.203492+00	
00000000-0000-0000-0000-000000000000	66bff6de-ab01-4ed7-a61b-39172f69ad29	{"action":"token_refreshed","actor_id":"6c806f28-8135-4406-8a4e-e7a8c5fdadec","actor_username":"sergioco@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-30 21:39:50.091719+00	
00000000-0000-0000-0000-000000000000	4518238b-9336-44c3-8cb2-bb7ce71fe1d2	{"action":"token_refreshed","actor_id":"6c806f28-8135-4406-8a4e-e7a8c5fdadec","actor_username":"sergioco@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-30 22:41:20.283242+00	
00000000-0000-0000-0000-000000000000	7253c308-69c4-4533-aad2-7011a154fbc0	{"action":"token_revoked","actor_id":"6c806f28-8135-4406-8a4e-e7a8c5fdadec","actor_username":"sergioco@dental.company","actor_via_sso":false,"log_type":"token"}	2025-09-30 22:41:20.307492+00	
00000000-0000-0000-0000-000000000000	8e102299-d81c-4cb2-937c-1833591204fc	{"action":"token_refreshed","actor_id":"6c806f28-8135-4406-8a4e-e7a8c5fdadec","actor_username":"sergioco@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-01 12:58:23.635491+00	
00000000-0000-0000-0000-000000000000	518a3985-429d-4617-a811-0aec517c2630	{"action":"token_revoked","actor_id":"6c806f28-8135-4406-8a4e-e7a8c5fdadec","actor_username":"sergioco@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-01 12:58:23.669562+00	
00000000-0000-0000-0000-000000000000	7146d1f3-9a54-4bb9-856f-dafa3d9f6237	{"action":"token_refreshed","actor_id":"6c806f28-8135-4406-8a4e-e7a8c5fdadec","actor_username":"sergioco@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-01 14:04:30.829803+00	
00000000-0000-0000-0000-000000000000	20857809-2aff-410d-9422-1c897ab2f313	{"action":"token_revoked","actor_id":"6c806f28-8135-4406-8a4e-e7a8c5fdadec","actor_username":"sergioco@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-01 14:04:30.85239+00	
00000000-0000-0000-0000-000000000000	6fb057bd-fde9-49ef-ba02-e2884fbe8e43	{"action":"token_refreshed","actor_id":"6c806f28-8135-4406-8a4e-e7a8c5fdadec","actor_username":"sergioco@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-01 15:04:29.305639+00	
00000000-0000-0000-0000-000000000000	d628d28f-96b6-49e3-b6a6-5374a918d373	{"action":"token_revoked","actor_id":"6c806f28-8135-4406-8a4e-e7a8c5fdadec","actor_username":"sergioco@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-01 15:04:29.344012+00	
00000000-0000-0000-0000-000000000000	a1db236e-e9b0-45e4-92bb-d94711eb7ae6	{"action":"token_refreshed","actor_id":"6c806f28-8135-4406-8a4e-e7a8c5fdadec","actor_username":"sergioco@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-01 17:23:55.975138+00	
00000000-0000-0000-0000-000000000000	483da211-fa5a-4753-9b6c-e2fc618d3696	{"action":"token_revoked","actor_id":"6c806f28-8135-4406-8a4e-e7a8c5fdadec","actor_username":"sergioco@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-01 17:23:55.996957+00	
00000000-0000-0000-0000-000000000000	473b148e-06ac-4555-a426-f0b6c1ec350e	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-01 18:21:16.371237+00	
00000000-0000-0000-0000-000000000000	f4d593d5-2b04-4afb-9a10-a403d087d787	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-01 18:21:16.384484+00	
00000000-0000-0000-0000-000000000000	0a57bc20-dfa4-43bf-b257-e65a0611e873	{"action":"token_refreshed","actor_id":"6c806f28-8135-4406-8a4e-e7a8c5fdadec","actor_username":"sergioco@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-01 18:24:36.941911+00	
00000000-0000-0000-0000-000000000000	96866852-49ea-4ed6-bd28-8141be50d076	{"action":"token_revoked","actor_id":"6c806f28-8135-4406-8a4e-e7a8c5fdadec","actor_username":"sergioco@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-01 18:24:36.948042+00	
00000000-0000-0000-0000-000000000000	ebb10437-1a96-499e-a7c1-718d06d16caf	{"action":"token_refreshed","actor_id":"6c806f28-8135-4406-8a4e-e7a8c5fdadec","actor_username":"sergioco@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-01 19:23:44.34149+00	
00000000-0000-0000-0000-000000000000	22e86642-2faf-4864-8136-102cc3bf2343	{"action":"token_revoked","actor_id":"6c806f28-8135-4406-8a4e-e7a8c5fdadec","actor_username":"sergioco@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-01 19:23:44.353011+00	
00000000-0000-0000-0000-000000000000	8abd7e14-171f-4012-bdd6-6f766e58bc2a	{"action":"token_refreshed","actor_id":"6c806f28-8135-4406-8a4e-e7a8c5fdadec","actor_username":"sergioco@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-01 20:27:34.351141+00	
00000000-0000-0000-0000-000000000000	ae9bd4de-e1c3-43d8-8da6-2aa24fa3017d	{"action":"token_revoked","actor_id":"6c806f28-8135-4406-8a4e-e7a8c5fdadec","actor_username":"sergioco@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-01 20:27:34.382277+00	
00000000-0000-0000-0000-000000000000	df034a0c-d580-4d90-8c25-344fee12f00f	{"action":"token_refreshed","actor_id":"6c806f28-8135-4406-8a4e-e7a8c5fdadec","actor_username":"sergioco@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-06 03:29:49.277559+00	
00000000-0000-0000-0000-000000000000	f59480cf-af29-43ad-b28b-5aa6bbc4635e	{"action":"token_revoked","actor_id":"6c806f28-8135-4406-8a4e-e7a8c5fdadec","actor_username":"sergioco@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-06 03:29:49.308841+00	
00000000-0000-0000-0000-000000000000	31851170-ac75-44f8-bef8-5e646e0af7ca	{"action":"logout","actor_id":"6c806f28-8135-4406-8a4e-e7a8c5fdadec","actor_username":"sergioco@dental.company","actor_via_sso":false,"log_type":"account"}	2025-10-06 03:30:54.971233+00	
00000000-0000-0000-0000-000000000000	d8ae3ec7-a9c2-4a81-8692-eab9b4073f0e	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-06 03:31:05.105314+00	
00000000-0000-0000-0000-000000000000	e8194f36-c6ff-4e4e-ae5b-7a6b71c3cec6	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-06 05:03:41.540582+00	
00000000-0000-0000-0000-000000000000	453dc243-55ec-426f-bb71-3fe03f21b1c7	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-06 05:03:41.561611+00	
00000000-0000-0000-0000-000000000000	05ee2864-58a6-45d0-9ce5-fc255a091b87	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-06 06:03:50.567691+00	
00000000-0000-0000-0000-000000000000	4e70ebc5-9b57-47f4-a09d-13ef8ca0d142	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-06 06:03:50.599081+00	
00000000-0000-0000-0000-000000000000	6210f9b6-0aed-4015-9883-1ba610efb966	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-06 13:58:16.074192+00	
00000000-0000-0000-0000-000000000000	b9271abd-be12-4e53-a89e-00f9d7fe7bc8	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-06 13:58:16.104919+00	
00000000-0000-0000-0000-000000000000	5ddb9386-1e71-44d1-a6ef-ec91fa07167d	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-06 14:37:39.890363+00	
00000000-0000-0000-0000-000000000000	217af5fb-6c3d-4d3e-9977-b127fceb0c42	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-06 14:37:39.909351+00	
00000000-0000-0000-0000-000000000000	a9d136a0-47be-4e5f-aa7b-a51f4a63b839	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-06 15:00:13.160425+00	
00000000-0000-0000-0000-000000000000	228deaf4-7554-4ed2-8f9f-4ad199a04cf5	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-06 15:00:13.18081+00	
00000000-0000-0000-0000-000000000000	85e09dfe-4b51-4acd-9b1e-0e18cfa2576d	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-06 16:04:09.996346+00	
00000000-0000-0000-0000-000000000000	d9c38b08-8a5a-47dc-ad3d-7162e9ac00b8	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-06 16:04:10.026483+00	
00000000-0000-0000-0000-000000000000	733d3682-882b-42f0-a3d8-8a8c69b72758	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-06 16:07:53.871762+00	
00000000-0000-0000-0000-000000000000	a4c0992d-e65e-4bc2-af99-080e8786225e	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-06 16:07:53.875106+00	
00000000-0000-0000-0000-000000000000	002e86f7-adf3-41f1-b2b7-be801259b469	{"action":"token_refreshed","actor_id":"141b2519-daf3-4bf8-8dac-e97840181403","actor_username":"test_personal@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-06 16:23:11.388198+00	
00000000-0000-0000-0000-000000000000	2cd87220-705c-4bc4-8ba5-c706bd841911	{"action":"token_revoked","actor_id":"141b2519-daf3-4bf8-8dac-e97840181403","actor_username":"test_personal@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-06 16:23:11.405113+00	
00000000-0000-0000-0000-000000000000	1f97c022-466c-49c4-b8dc-c8cb0c1bd3d7	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-06 16:45:51.723945+00	
00000000-0000-0000-0000-000000000000	cbb6d822-65be-4056-8d91-9deebb61ac23	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-06 16:45:51.737736+00	
00000000-0000-0000-0000-000000000000	704195d9-daf0-49a7-b8a5-66de4b093463	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-06 16:45:52.849689+00	
00000000-0000-0000-0000-000000000000	a4193df4-bbfa-46e7-b46b-74c85575ace7	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-06 16:46:02.563085+00	
00000000-0000-0000-0000-000000000000	a5e8c48d-14b9-437f-aff6-47ba660c0ef0	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-06 17:06:38.703916+00	
00000000-0000-0000-0000-000000000000	5c27f8ed-e88d-486f-b08e-f244273089ad	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-06 17:06:38.732552+00	
00000000-0000-0000-0000-000000000000	e5258610-0940-485b-9c1e-07ab1047791f	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-06 18:08:44.647975+00	
00000000-0000-0000-0000-000000000000	02bbe1c6-8b09-4323-834a-5e4fe7ad53e6	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-06 18:08:44.666987+00	
00000000-0000-0000-0000-000000000000	d5484ad6-d202-42e6-b58d-0ec40b18bfdc	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-06 18:54:51.211485+00	
00000000-0000-0000-0000-000000000000	f6243d5b-f5e7-46aa-98ce-43abe4f91d83	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-06 18:54:51.226788+00	
00000000-0000-0000-0000-000000000000	3266979a-fcdf-4249-b13b-f254c1e05227	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-06 18:57:21.63883+00	
00000000-0000-0000-0000-000000000000	c3c4426e-b4ca-41ab-a75e-1a1e46cd09e9	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-06 18:57:21.640206+00	
00000000-0000-0000-0000-000000000000	b4aa274b-61e8-48da-b8ff-a5c8e3be054a	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-06 21:25:24.246941+00	
00000000-0000-0000-0000-000000000000	920c87d8-e0fd-497a-8a24-b137cec2f343	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-06 21:25:24.274212+00	
00000000-0000-0000-0000-000000000000	838e6f6a-f703-42cf-b355-21b857d74f92	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-06 21:26:23.5927+00	
00000000-0000-0000-0000-000000000000	49483b9c-f73e-48c1-bee8-f230e7d10020	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-06 21:26:23.59464+00	
00000000-0000-0000-0000-000000000000	1424eb88-64d3-47fe-a22d-7652f1be8cd7	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-06 21:26:26.650091+00	
00000000-0000-0000-0000-000000000000	24222654-8509-4d8f-a2e6-abdc433787c8	{"action":"logout","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account"}	2025-10-06 21:27:21.807549+00	
00000000-0000-0000-0000-000000000000	8ccf7358-3f03-41cc-9a6a-2979b8938d14	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-07 16:05:54.285971+00	
00000000-0000-0000-0000-000000000000	57b62521-f8a6-472d-864a-93ca720dec90	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-07 16:05:54.306631+00	
00000000-0000-0000-0000-000000000000	5e6a4c4c-bd69-4e3b-b63d-800ef0014043	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-07 16:22:01.416544+00	
00000000-0000-0000-0000-000000000000	029522fa-599a-42c4-8301-bf42cb4117d8	{"action":"logout","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account"}	2025-10-07 16:23:29.698948+00	
00000000-0000-0000-0000-000000000000	808f1355-089e-4b6f-814f-48ce47f50f38	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-07 16:32:44.78009+00	
00000000-0000-0000-0000-000000000000	fbece2eb-ba52-4298-9492-31b964b8225a	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-07 16:56:16.750165+00	
00000000-0000-0000-0000-000000000000	f778d619-5580-40f0-9211-4306d1c91016	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-07 16:56:18.440137+00	
00000000-0000-0000-0000-000000000000	abeee4ef-edfa-4911-b634-a5ce5f1f0bf5	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-07 16:56:20.0273+00	
00000000-0000-0000-0000-000000000000	cf36565e-93f6-462a-bc7a-a3a38acd5516	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-07 16:56:20.4095+00	
00000000-0000-0000-0000-000000000000	9dc4de07-1f79-42b3-92ff-55ac92c04605	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-07 16:56:20.756304+00	
00000000-0000-0000-0000-000000000000	092d2326-1bc6-4d84-aedb-07b5b9676a32	{"action":"logout","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account"}	2025-10-07 16:56:51.137593+00	
00000000-0000-0000-0000-000000000000	df3551f2-d4d1-4a99-8db5-55a9c676271f	{"action":"logout","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account"}	2025-10-07 17:16:38.044369+00	
00000000-0000-0000-0000-000000000000	e942b7a9-880a-4d7e-9f27-dfb3e0f7766a	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-08 04:46:53.382622+00	
00000000-0000-0000-0000-000000000000	370bf668-a844-4701-80a8-8002cb939eac	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-08 04:47:12.709212+00	
00000000-0000-0000-0000-000000000000	bfa58187-5ba5-4677-bac9-6285d671fcf1	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-08 04:47:38.16499+00	
00000000-0000-0000-0000-000000000000	857fe724-74ce-461d-9938-72adf8910646	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-08 04:47:53.595519+00	
00000000-0000-0000-0000-000000000000	007d7e93-37a2-4242-867f-f055f5a9ebd3	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-08 04:48:37.260109+00	
00000000-0000-0000-0000-000000000000	002671c4-ac15-4fee-b923-8e52f1c04aa5	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-09 02:21:38.138339+00	
00000000-0000-0000-0000-000000000000	76184b5e-11ae-49dd-88fc-2161af938d81	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-09 02:21:38.165855+00	
00000000-0000-0000-0000-000000000000	0abed1e1-4386-45f3-99a7-68ca9103a1fd	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-09 02:22:46.392347+00	
00000000-0000-0000-0000-000000000000	d2881bd8-63d9-411c-b2e3-374f4b2fb4b5	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-09 04:18:23.668001+00	
00000000-0000-0000-0000-000000000000	b0773cf1-82d2-48a9-8535-411df6cbdd2f	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-09 04:18:23.6954+00	
00000000-0000-0000-0000-000000000000	7c4e78ff-9214-4560-a5c2-a1099099f225	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-09 04:19:09.885852+00	
00000000-0000-0000-0000-000000000000	e6ebfa01-5bbf-46d0-8088-c8059c1bf8f6	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-09 05:04:37.329916+00	
00000000-0000-0000-0000-000000000000	1b94c25e-4e76-4ffa-a188-55e3496ebc42	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-09 05:54:49.592126+00	
00000000-0000-0000-0000-000000000000	673b31fa-0507-474c-aafe-c581e44d21e3	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-09 06:55:32.184328+00	
00000000-0000-0000-0000-000000000000	90455e1a-0bc6-4784-9931-b51580355665	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-09 06:55:32.207575+00	
00000000-0000-0000-0000-000000000000	60973bac-2305-446e-a73b-b62d2ee72cdf	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-09 07:54:03.274337+00	
00000000-0000-0000-0000-000000000000	469b9637-d78b-45a9-a6fd-f6901bb328cd	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-09 07:54:03.296876+00	
00000000-0000-0000-0000-000000000000	39685abd-fe68-42f7-8624-b1c007b783ba	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-09 08:53:44.051242+00	
00000000-0000-0000-0000-000000000000	6359bc3f-04ca-4632-89cd-917edfb13eb4	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-09 08:53:44.07703+00	
00000000-0000-0000-0000-000000000000	2ed6bf36-c860-4258-a4ab-c3f79d341d03	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-09 14:40:32.876356+00	
00000000-0000-0000-0000-000000000000	eecaeac6-d174-4598-b23b-4ca243409bb9	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-09 14:40:32.903737+00	
00000000-0000-0000-0000-000000000000	2ac56b21-258f-4a1f-bf37-fe30dc71df3e	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-09 14:56:12.225763+00	
00000000-0000-0000-0000-000000000000	a526d7b2-8889-4e43-84eb-43bc519ceab2	{"action":"user_signedup","actor_id":"472e0026-4625-4b47-90f9-5319ffad53bd","actor_username":"admin@dental.company","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-10-12 05:32:25.770196+00	
00000000-0000-0000-0000-000000000000	ff5c3e85-c096-4116-a0ac-071c19dfb5dd	{"action":"login","actor_id":"472e0026-4625-4b47-90f9-5319ffad53bd","actor_username":"admin@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 05:32:25.812863+00	
00000000-0000-0000-0000-000000000000	8cbe5554-8762-4fe6-8ae9-b67ca2c4d189	{"action":"login","actor_id":"472e0026-4625-4b47-90f9-5319ffad53bd","actor_username":"admin@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 05:32:33.336817+00	
00000000-0000-0000-0000-000000000000	bb390f1b-39c0-4f52-a83c-542e15b69cd5	{"action":"logout","actor_id":"472e0026-4625-4b47-90f9-5319ffad53bd","actor_username":"admin@dental.company","actor_via_sso":false,"log_type":"account"}	2025-10-12 05:50:50.182894+00	
00000000-0000-0000-0000-000000000000	af2580ae-4134-47b4-9b21-1d2cf37aa7d8	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-13 13:20:08.615599+00	
00000000-0000-0000-0000-000000000000	638cc377-3a2a-4965-9c73-639fed43fa69	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-13 13:20:10.57423+00	
00000000-0000-0000-0000-000000000000	62760b40-46cc-4904-8c22-ab947bd1c427	{"action":"logout","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account"}	2025-10-13 13:25:32.367416+00	
00000000-0000-0000-0000-000000000000	916d9d89-d921-4f78-b8c4-3fb28602d4f7	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-13 13:25:51.621413+00	
00000000-0000-0000-0000-000000000000	b235b613-7917-4d14-a484-ef3b8b7b1a42	{"action":"logout","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account"}	2025-10-13 13:33:28.932786+00	
00000000-0000-0000-0000-000000000000	234ae12c-7002-4c80-b725-100937655e84	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-13 13:34:38.137017+00	
00000000-0000-0000-0000-000000000000	f7b2d234-7e56-4fb8-9b54-f815d75b2d33	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-13 13:34:40.095732+00	
00000000-0000-0000-0000-000000000000	2705589a-6f6e-447d-b30c-5f531cb4446b	{"action":"logout","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account"}	2025-10-13 13:56:53.900371+00	
00000000-0000-0000-0000-000000000000	0d76ca23-35a1-463f-a628-1c8dc2011f98	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-13 17:10:42.14154+00	
00000000-0000-0000-0000-000000000000	03a44536-5292-40eb-9e43-4f7c9970c304	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-13 17:29:36.023253+00	
00000000-0000-0000-0000-000000000000	8d57d821-ec3c-4228-bf8c-fd6b733a900e	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-13 17:38:22.769162+00	
00000000-0000-0000-0000-000000000000	1703f48a-9cde-4a13-a02c-41fc2e82c9f1	{"action":"logout","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account"}	2025-10-13 17:42:38.004419+00	
00000000-0000-0000-0000-000000000000	08889bf5-8298-41c8-bcd1-f6ac6ba447a3	{"action":"user_repeated_signup","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-10-18 07:15:53.455638+00	
00000000-0000-0000-0000-000000000000	d3078cd0-bd5d-4301-9288-d6584716a00f	{"action":"user_signedup","actor_id":"6461c7bb-99f6-4e74-9ade-5b4219d70c12","actor_username":"admin12@dental.company","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-10-18 07:16:01.817669+00	
00000000-0000-0000-0000-000000000000	dbcb07cf-2e1e-46e7-a125-7b9fca9d597c	{"action":"login","actor_id":"6461c7bb-99f6-4e74-9ade-5b4219d70c12","actor_username":"admin12@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-18 07:16:01.837288+00	
00000000-0000-0000-0000-000000000000	1538cf5a-b064-4988-96f1-085071b621aa	{"action":"login","actor_id":"6461c7bb-99f6-4e74-9ade-5b4219d70c12","actor_username":"admin12@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-18 07:16:07.039338+00	
00000000-0000-0000-0000-000000000000	4f7d61ea-03bb-4f73-8dd9-5b00fbf046c0	{"action":"login","actor_id":"6461c7bb-99f6-4e74-9ade-5b4219d70c12","actor_username":"admin12@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-18 07:16:09.036309+00	
00000000-0000-0000-0000-000000000000	f87a1112-0ed1-4e68-a15a-ee22f1475781	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-20 13:32:03.255397+00	
00000000-0000-0000-0000-000000000000	acf62a0d-4706-4fa3-adf8-4203fa7748bd	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-20 13:32:05.456198+00	
00000000-0000-0000-0000-000000000000	3f72e21a-e6a4-4c9d-8bd3-6b90739f2a04	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-20 14:31:14.701385+00	
00000000-0000-0000-0000-000000000000	84ddd80e-54d4-4a2f-b2b3-d3b781cd7dfa	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-20 14:31:14.730625+00	
00000000-0000-0000-0000-000000000000	3ee1a558-f965-490b-9116-0a7cac09df76	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-20 15:34:42.539577+00	
00000000-0000-0000-0000-000000000000	d969a571-b9d1-4c59-a917-a6dc02cc2303	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-20 15:34:42.565424+00	
00000000-0000-0000-0000-000000000000	6b79801f-ad55-41b9-bca7-e6a4828fc7d3	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-20 16:45:48.139101+00	
00000000-0000-0000-0000-000000000000	588d4343-677f-442f-ba12-01274bc86ab4	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-20 16:45:48.166128+00	
00000000-0000-0000-0000-000000000000	8dd92fa9-c9a4-43b1-a40d-b9c29c159b98	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-20 16:45:48.240939+00	
00000000-0000-0000-0000-000000000000	03d0fb73-eb8c-46a3-b239-1ab87947f592	{"action":"logout","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account"}	2025-10-20 17:21:33.777654+00	
00000000-0000-0000-0000-000000000000	881ebe26-c076-4af5-8640-d37dff401646	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-20 17:28:10.85543+00	
00000000-0000-0000-0000-000000000000	15b1786f-8572-4c02-9a9a-961f3ac3d4eb	{"action":"logout","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account"}	2025-10-20 17:37:16.426844+00	
00000000-0000-0000-0000-000000000000	a1119446-db00-4f64-a978-ec459292de61	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-20 17:37:43.766856+00	
00000000-0000-0000-0000-000000000000	ec38ddec-a724-481e-883b-3aa20cce8c80	{"action":"logout","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account"}	2025-10-20 17:47:28.910766+00	
00000000-0000-0000-0000-000000000000	e622c6cd-5225-4c00-ae46-13302d3cecd1	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-20 17:48:42.210268+00	
00000000-0000-0000-0000-000000000000	66c82aa3-2285-460c-af58-91a75f4017bb	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-20 17:57:20.098943+00	
00000000-0000-0000-0000-000000000000	e45cf35d-2d52-4262-9032-b5a39a46b656	{"action":"logout","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account"}	2025-10-20 18:00:22.186281+00	
00000000-0000-0000-0000-000000000000	09d91ee6-4951-4fa9-87f0-16a802b9390f	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-20 18:09:30.094104+00	
00000000-0000-0000-0000-000000000000	755da0ed-8e42-4db8-a2c6-a697590bc5d7	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-20 18:09:30.892569+00	
00000000-0000-0000-0000-000000000000	a28bb8e3-2db0-4462-93dc-3bbe5cd32101	{"action":"logout","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account"}	2025-10-20 18:19:27.985131+00	
00000000-0000-0000-0000-000000000000	addbff1f-f475-43b0-a7e4-904332480725	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-20 18:20:06.807557+00	
00000000-0000-0000-0000-000000000000	d45cfb0c-e475-4d74-ba57-f7ccc28d8568	{"action":"token_refreshed","actor_id":"141b2519-daf3-4bf8-8dac-e97840181403","actor_username":"test_personal@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-20 23:54:00.953725+00	
00000000-0000-0000-0000-000000000000	c18e7f26-0fad-4fd8-8bec-2b82d9145dbe	{"action":"token_revoked","actor_id":"141b2519-daf3-4bf8-8dac-e97840181403","actor_username":"test_personal@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-20 23:54:00.98152+00	
00000000-0000-0000-0000-000000000000	cebd470c-8691-40d7-84ba-44668afb24ff	{"action":"token_refreshed","actor_id":"141b2519-daf3-4bf8-8dac-e97840181403","actor_username":"test_personal@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-20 23:54:01.584622+00	
00000000-0000-0000-0000-000000000000	edb75a3e-12c5-48bc-8e96-15180ef66ef8	{"action":"token_refreshed","actor_id":"6461c7bb-99f6-4e74-9ade-5b4219d70c12","actor_username":"admin12@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-21 00:18:32.934325+00	
00000000-0000-0000-0000-000000000000	2740641f-aa87-4549-aa58-e2de7ec10e32	{"action":"token_revoked","actor_id":"6461c7bb-99f6-4e74-9ade-5b4219d70c12","actor_username":"admin12@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-21 00:18:32.948552+00	
00000000-0000-0000-0000-000000000000	5fd64752-1643-42f0-aa2e-af972f26c795	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-21 00:56:47.387232+00	
00000000-0000-0000-0000-000000000000	1c0705ce-97ae-4201-83e2-f56b30475c65	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-21 00:56:47.404585+00	
00000000-0000-0000-0000-000000000000	1b020e01-6f72-4edb-b109-e2aa13f839e9	{"action":"logout","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account"}	2025-10-21 00:57:03.060793+00	
00000000-0000-0000-0000-000000000000	9bc2df45-1c13-455c-bc98-92aacaae2228	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-21 00:57:13.433788+00	
00000000-0000-0000-0000-000000000000	258479fc-d16b-4cc0-95a3-8ab4202ae8db	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-21 01:15:08.738129+00	
00000000-0000-0000-0000-000000000000	96630135-b707-4c0f-ad03-ebd8098f096f	{"action":"login","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-21 01:16:16.833687+00	
00000000-0000-0000-0000-000000000000	f0a44110-0024-481b-a8cf-80d15dcb4db5	{"action":"logout","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account"}	2025-10-21 01:38:38.699322+00	
00000000-0000-0000-0000-000000000000	f5300f18-744b-4485-99f2-dd342bb278a3	{"action":"logout","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account"}	2025-10-21 01:46:58.790977+00	
00000000-0000-0000-0000-000000000000	e101edff-da53-49f4-bb08-d62062bc8818	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-21 01:47:02.759765+00	
00000000-0000-0000-0000-000000000000	20b1e29d-fd77-4636-8289-88a4f09923eb	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-21 02:35:59.348098+00	
00000000-0000-0000-0000-000000000000	26652014-a400-4265-a1b0-fdc746952876	{"action":"token_refreshed","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-21 02:36:26.621828+00	
00000000-0000-0000-0000-000000000000	199f0407-0b6f-49f1-b42b-2a4d86ee7adb	{"action":"token_revoked","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-21 02:36:26.623878+00	
00000000-0000-0000-0000-000000000000	3bca3553-7fa3-4f4f-95c5-a609ae936417	{"action":"token_refreshed","actor_id":"141b2519-daf3-4bf8-8dac-e97840181403","actor_username":"test_personal@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-21 02:37:13.714337+00	
00000000-0000-0000-0000-000000000000	0539d5e8-3b79-4949-b231-dcf897447324	{"action":"token_revoked","actor_id":"141b2519-daf3-4bf8-8dac-e97840181403","actor_username":"test_personal@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-21 02:37:13.716982+00	
00000000-0000-0000-0000-000000000000	8691906c-aa1d-410a-abef-098414cb26c9	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-21 10:34:50.207687+00	
00000000-0000-0000-0000-000000000000	a5b356ed-cef5-4db1-b7f4-40068f40c133	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-21 10:34:50.238094+00	
00000000-0000-0000-0000-000000000000	36ff21f0-229c-47d5-bc48-ea27bcee1c2b	{"action":"logout","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account"}	2025-10-21 10:35:04.161638+00	
00000000-0000-0000-0000-000000000000	b51ae687-fd68-4489-a5fe-90d4786a527f	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-21 10:35:08.818852+00	
00000000-0000-0000-0000-000000000000	324f34be-1841-483a-ae60-aa5f7514df1d	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-27 13:08:47.97944+00	
00000000-0000-0000-0000-000000000000	498d0434-5c3f-47c2-a6fe-8516c6223997	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-27 13:57:03.842064+00	
00000000-0000-0000-0000-000000000000	7540f0db-1216-4678-9f96-fa48bb1759be	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-27 13:57:03.865373+00	
00000000-0000-0000-0000-000000000000	4d92d236-6d12-4a48-a2b6-3acbab4d75a4	{"action":"logout","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account"}	2025-10-27 13:57:14.202491+00	
00000000-0000-0000-0000-000000000000	8d6b916e-a6df-4bc3-9745-4aa2942fef38	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-27 13:57:25.792621+00	
00000000-0000-0000-0000-000000000000	611f0f7b-10df-4009-bf76-99e184a49a3e	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-27 14:13:54.310144+00	
00000000-0000-0000-0000-000000000000	9896143f-0613-47cc-bc2d-64efdf43cb37	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-27 15:00:42.586456+00	
00000000-0000-0000-0000-000000000000	039dc4eb-e909-4eea-a55f-4fc5e41bbbb4	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-27 15:00:42.606235+00	
00000000-0000-0000-0000-000000000000	16b5a771-c65f-4e7d-ba34-2938ed68164d	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-27 15:14:38.7587+00	
00000000-0000-0000-0000-000000000000	71850acc-63e0-4b6d-acf7-6c797b3dac17	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-27 15:14:38.784952+00	
00000000-0000-0000-0000-000000000000	6a327de3-41af-491b-a4b0-9dfda13bff74	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-27 16:01:24.986922+00	
00000000-0000-0000-0000-000000000000	be31ba6d-4536-4765-bc41-25cae0255758	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-27 16:01:25.012232+00	
00000000-0000-0000-0000-000000000000	f7fa9b26-3a0d-455c-abd6-24e2e50a6aba	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-27 17:42:24.955161+00	
00000000-0000-0000-0000-000000000000	80079dc4-7d9b-45bb-9cb1-64f63860ecfb	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-27 17:42:24.986837+00	
00000000-0000-0000-0000-000000000000	689733a8-c443-48d5-b95e-25643aef5825	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-27 18:44:53.748031+00	
00000000-0000-0000-0000-000000000000	dd689bfa-33dc-4d06-bf58-0a0e4e62fae5	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-27 18:44:53.767891+00	
00000000-0000-0000-0000-000000000000	8a8d3303-d4b1-421c-bac4-ad27c89fdea0	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-27 22:05:40.594571+00	
00000000-0000-0000-0000-000000000000	c687d49a-6f76-4ba0-a2c4-59ee9654a9ad	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-27 22:05:40.623603+00	
00000000-0000-0000-0000-000000000000	5f1f43c5-a6ce-4f33-a216-4ad22eced0e8	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-27 22:06:02.60948+00	
00000000-0000-0000-0000-000000000000	d03aaacc-34d6-481a-a7a8-e7ec3633d69b	{"action":"logout","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account"}	2025-10-27 22:06:08.667284+00	
00000000-0000-0000-0000-000000000000	847191d1-3395-461d-a107-ed6bd66b7090	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-27 22:06:22.276273+00	
00000000-0000-0000-0000-000000000000	33893c74-a6bd-4d68-ab6f-ba05a1e05e9a	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-27 22:09:21.288038+00	
00000000-0000-0000-0000-000000000000	ea50c357-bc9c-49ea-b21c-ef53a4ffd3a2	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-27 22:09:23.213619+00	
00000000-0000-0000-0000-000000000000	d37ea917-73c1-4a67-b1e3-48f3c4321ab1	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-27 22:09:26.743241+00	
00000000-0000-0000-0000-000000000000	ed561f74-ba75-40c0-9bfa-884ea66e67ee	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-27 22:09:28.257011+00	
00000000-0000-0000-0000-000000000000	25b4d2a1-321e-4e87-bbb5-476bf7085769	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-27 22:09:28.648744+00	
00000000-0000-0000-0000-000000000000	e7e04e44-5d1d-45ef-8c72-b4c005885ff9	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-27 22:09:29.514747+00	
00000000-0000-0000-0000-000000000000	b3fbb50b-0fe7-4943-b683-c9691095b7cb	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-27 22:09:30.797849+00	
00000000-0000-0000-0000-000000000000	351fe6a1-125c-44f4-bc8e-5101e2ac8303	{"action":"token_refreshed","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-28 00:11:41.575201+00	
00000000-0000-0000-0000-000000000000	60f69711-7b39-4024-8961-6478f713c9e2	{"action":"token_revoked","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-28 00:11:41.598113+00	
00000000-0000-0000-0000-000000000000	bff055b7-d8fc-4253-bb7d-9f270a50fc12	{"action":"token_refreshed","actor_id":"141b2519-daf3-4bf8-8dac-e97840181403","actor_username":"test_personal@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-28 00:41:48.054764+00	
00000000-0000-0000-0000-000000000000	e531c82a-5682-494e-9ff9-f0d766c32f6c	{"action":"token_revoked","actor_id":"141b2519-daf3-4bf8-8dac-e97840181403","actor_username":"test_personal@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-28 00:41:48.070727+00	
00000000-0000-0000-0000-000000000000	df73eae5-63aa-45c1-b76d-8a9043531529	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-28 14:46:57.755302+00	
00000000-0000-0000-0000-000000000000	57c040f1-5329-4b13-9704-7c34d18112da	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-28 14:47:07.394296+00	
00000000-0000-0000-0000-000000000000	01f9f328-9cf9-4199-a6c4-8ef0d7fe532e	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-28 14:49:01.819178+00	
00000000-0000-0000-0000-000000000000	da9febf0-4d6d-40a0-9fc7-f12c4e327036	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-28 22:17:11.791662+00	
00000000-0000-0000-0000-000000000000	90d59b9d-cd80-4c33-9364-bcc5beb3d8c4	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-28 22:17:11.823811+00	
00000000-0000-0000-0000-000000000000	fac9be95-8c74-40ae-bd71-01e5099d6b2d	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-28 23:16:20.141774+00	
00000000-0000-0000-0000-000000000000	7b34fb1b-58f9-4ea5-b1f1-9412a057e86c	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-28 23:16:20.159695+00	
00000000-0000-0000-0000-000000000000	aa833a48-5b1e-4093-94b1-ecbb375ed5cf	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-29 00:17:23.747302+00	
00000000-0000-0000-0000-000000000000	cad54078-62bb-4f00-b2af-b10c6214957f	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-29 00:17:23.770067+00	
00000000-0000-0000-0000-000000000000	e04ba93b-2ac0-4ca5-9e70-5b472a813258	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-29 00:17:23.837564+00	
00000000-0000-0000-0000-000000000000	73bf377f-6dd1-456c-ad92-48f7e9638948	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-29 02:55:25.79608+00	
00000000-0000-0000-0000-000000000000	f9b41ac2-6700-4fd3-bf57-8a7e9dba85d5	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-29 02:55:25.811774+00	
00000000-0000-0000-0000-000000000000	9a09ea1a-030d-40a9-aed4-a25706f2c2b3	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-29 03:08:28.821218+00	
00000000-0000-0000-0000-000000000000	f07b7325-edd0-4e47-833e-4b2b8c0b5a36	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-29 06:58:28.605488+00	
00000000-0000-0000-0000-000000000000	76160443-4ea9-466a-bd1e-d1836f77fe56	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-29 06:58:28.621628+00	
00000000-0000-0000-0000-000000000000	81c77977-0da4-477d-8775-cc6b89289e69	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-29 07:59:13.748481+00	
00000000-0000-0000-0000-000000000000	694b5a45-aded-4753-b7b9-2e72b20f2d49	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-29 07:59:13.762812+00	
00000000-0000-0000-0000-000000000000	1859c4da-e1d2-43a6-8994-a42337fd6709	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-29 12:24:56.083735+00	
00000000-0000-0000-0000-000000000000	b24da170-ea37-43d1-ae0e-77c0e32124b2	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-29 12:24:56.107228+00	
00000000-0000-0000-0000-000000000000	1e8d5d16-6940-4570-9173-8292ae4360d2	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-29 12:24:57.856172+00	
00000000-0000-0000-0000-000000000000	5c19997e-04c9-44e1-a56c-b679b56b1a64	{"action":"logout","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account"}	2025-10-29 12:25:17.833002+00	
00000000-0000-0000-0000-000000000000	6da5c367-5002-40ca-8507-3e7e453ab2c4	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-29 12:25:20.488525+00	
00000000-0000-0000-0000-000000000000	e57732a7-7ca9-4523-8b8c-03f4df6be881	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-29 14:54:01.658096+00	
00000000-0000-0000-0000-000000000000	e177d708-c418-481e-83c3-79a2cf654c7a	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-29 15:01:29.336588+00	
00000000-0000-0000-0000-000000000000	477e19c9-3786-4aaf-9a28-90765e5b500f	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-29 15:40:35.964829+00	
00000000-0000-0000-0000-000000000000	6c01eefa-e609-41e4-81e9-42e1ecc7da56	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-29 15:40:35.977086+00	
00000000-0000-0000-0000-000000000000	427df675-db65-4010-8cf0-4875096ddc07	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-29 15:50:21.066252+00	
00000000-0000-0000-0000-000000000000	9e58048b-3eb5-4de3-af3e-37aa6415330b	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-29 15:50:21.067734+00	
00000000-0000-0000-0000-000000000000	01926ac9-2cd6-4153-87f6-4c657a787603	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-29 15:50:28.227063+00	
00000000-0000-0000-0000-000000000000	eeca3637-b69d-4509-a66c-7250893815a9	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-29 15:52:15.005023+00	
00000000-0000-0000-0000-000000000000	b933bb1d-7307-42ed-a7b2-fd991986c66c	{"action":"token_refreshed","actor_id":"6461c7bb-99f6-4e74-9ade-5b4219d70c12","actor_username":"admin12@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-29 16:36:49.138788+00	
00000000-0000-0000-0000-000000000000	62124311-f243-4aa3-afae-9a570df47938	{"action":"token_revoked","actor_id":"6461c7bb-99f6-4e74-9ade-5b4219d70c12","actor_username":"admin12@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-29 16:36:49.163096+00	
00000000-0000-0000-0000-000000000000	e2325d25-3ced-44ae-87d7-1f8630830267	{"action":"token_refreshed","actor_id":"6461c7bb-99f6-4e74-9ade-5b4219d70c12","actor_username":"admin12@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-29 21:26:54.342182+00	
00000000-0000-0000-0000-000000000000	97312060-82f6-4495-80f1-0d2e3bae26e5	{"action":"token_revoked","actor_id":"6461c7bb-99f6-4e74-9ade-5b4219d70c12","actor_username":"admin12@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-29 21:26:54.361786+00	
00000000-0000-0000-0000-000000000000	6b31d3ab-c136-4ca7-bf70-99f20a331095	{"action":"token_refreshed","actor_id":"6461c7bb-99f6-4e74-9ade-5b4219d70c12","actor_username":"admin12@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-30 02:41:35.314616+00	
00000000-0000-0000-0000-000000000000	0a0ded57-95d6-4b50-960c-e0ae4eb7ec6e	{"action":"token_revoked","actor_id":"6461c7bb-99f6-4e74-9ade-5b4219d70c12","actor_username":"admin12@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-30 02:41:35.344244+00	
00000000-0000-0000-0000-000000000000	ac33823d-717a-47fa-9b68-fea12796ba8a	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-30 15:58:37.515843+00	
00000000-0000-0000-0000-000000000000	cee33886-1ba5-4976-939c-78cdbbed92af	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-30 15:58:37.543461+00	
00000000-0000-0000-0000-000000000000	f0c33b47-485b-45e5-bef1-dfbed47fcd8f	{"action":"logout","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account"}	2025-10-30 15:58:52.678096+00	
00000000-0000-0000-0000-000000000000	4bd4306d-42a2-4229-9a12-e27cf7195c5d	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-30 15:58:55.316308+00	
00000000-0000-0000-0000-000000000000	0bb8c992-1067-4370-894f-7e6603082495	{"action":"token_refreshed","actor_id":"6461c7bb-99f6-4e74-9ade-5b4219d70c12","actor_username":"admin12@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-30 16:28:01.042126+00	
00000000-0000-0000-0000-000000000000	daf929af-c082-4248-96b6-b670c95c18ca	{"action":"token_revoked","actor_id":"6461c7bb-99f6-4e74-9ade-5b4219d70c12","actor_username":"admin12@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-30 16:28:01.055833+00	
00000000-0000-0000-0000-000000000000	8ee8ced9-627d-4f02-83c0-c0c180758a17	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-31 14:53:49.731418+00	
00000000-0000-0000-0000-000000000000	922067a5-ab1e-4dce-b622-28ca3c51104c	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-31 14:53:49.757949+00	
00000000-0000-0000-0000-000000000000	44326d15-71e6-42d1-aec9-ea2dd81e84e8	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-31 15:28:46.542543+00	
00000000-0000-0000-0000-000000000000	caf9b0b0-9d18-427f-b8d5-832acf169755	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-10-31 15:28:46.595698+00	
00000000-0000-0000-0000-000000000000	35680072-8039-42c1-9434-939dc090f2d7	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-03 00:55:19.300376+00	
00000000-0000-0000-0000-000000000000	281c9815-9cf1-4a4c-b41c-3845dd62e1d1	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-03 00:55:19.328634+00	
00000000-0000-0000-0000-000000000000	4cfd0506-a6d6-425f-b295-03f4d18a2985	{"action":"logout","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-03 01:00:02.887526+00	
00000000-0000-0000-0000-000000000000	3c977d58-753c-45e4-833b-73943a07b03d	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-03 01:00:16.733872+00	
00000000-0000-0000-0000-000000000000	a7e9d99e-972b-4ead-8d75-edfedfcc69db	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-03 02:11:37.254079+00	
00000000-0000-0000-0000-000000000000	d689d4f8-8378-44a4-bb5f-016564ed82c3	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-03 02:11:37.267563+00	
00000000-0000-0000-0000-000000000000	187127c4-1d5b-47a5-a76b-f9a5f7523250	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-03 03:10:29.637931+00	
00000000-0000-0000-0000-000000000000	a4aece84-bb73-4eb6-9bea-c63a409ea041	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-03 03:10:29.663417+00	
00000000-0000-0000-0000-000000000000	f0287fd5-1390-44fc-aaff-e978ea7a0b23	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-03 04:09:01.025536+00	
00000000-0000-0000-0000-000000000000	672d02e0-b695-4de8-bf35-08b2de521918	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-03 04:09:01.052615+00	
00000000-0000-0000-0000-000000000000	12d77f25-794f-443b-a7d8-127f948509db	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-03 05:07:39.611419+00	
00000000-0000-0000-0000-000000000000	bfb4bc54-6cd5-422f-92e2-45c1aa2c40ff	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-03 05:07:39.63582+00	
00000000-0000-0000-0000-000000000000	cb62388a-202a-4676-950d-747b84cf17ee	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-03 05:09:34.702477+00	
00000000-0000-0000-0000-000000000000	4d820cda-b8a6-48d3-9fb6-0be87d6e64e3	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-03 05:09:34.709944+00	
00000000-0000-0000-0000-000000000000	a2653172-447f-45c1-a296-4649e80f5545	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-03 14:07:08.36932+00	
00000000-0000-0000-0000-000000000000	3a2c2b4f-f536-46bf-a679-e78a75d0bbc8	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-03 14:07:08.396696+00	
00000000-0000-0000-0000-000000000000	813148fe-b4a1-4f2f-945e-5b5578c23eef	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-03 15:16:38.496753+00	
00000000-0000-0000-0000-000000000000	c0793429-2950-49dc-8b4f-72d7f5369800	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-03 15:16:38.520072+00	
00000000-0000-0000-0000-000000000000	e1283ba2-44f1-4373-8a07-1dabb71e638f	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-03 15:59:50.889194+00	
00000000-0000-0000-0000-000000000000	4d427a6b-b0b5-4dec-917c-22247c907bf0	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-03 15:59:50.91123+00	
00000000-0000-0000-0000-000000000000	91f0b4cc-df2b-4e81-b2e3-961a0cfaac05	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-03 15:59:54.850601+00	
00000000-0000-0000-0000-000000000000	4e398c7c-8782-4638-aa27-ea55cfe85861	{"action":"token_refreshed","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-03 16:10:15.340967+00	
00000000-0000-0000-0000-000000000000	3ad2e21b-da4d-4bf2-82b4-80f749ee46a7	{"action":"token_revoked","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-03 16:10:15.350881+00	
00000000-0000-0000-0000-000000000000	b858b7a6-7d68-4a69-8b40-a0330e6ccfa8	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-03 16:18:00.125032+00	
00000000-0000-0000-0000-000000000000	0a3d1441-0a79-4354-bc0c-55bc81793a88	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-03 16:18:00.140383+00	
00000000-0000-0000-0000-000000000000	0fd88143-0ade-42df-ab94-f26f23d12247	{"action":"token_refreshed","actor_id":"141b2519-daf3-4bf8-8dac-e97840181403","actor_username":"test_personal@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-03 16:38:18.531306+00	
00000000-0000-0000-0000-000000000000	c93f4766-7a0c-43f9-90f7-0fdaf995ce94	{"action":"token_revoked","actor_id":"141b2519-daf3-4bf8-8dac-e97840181403","actor_username":"test_personal@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-03 16:38:18.547662+00	
00000000-0000-0000-0000-000000000000	17e3ecf7-cbcf-4b83-a7c9-4c7f9912ecfb	{"action":"token_refreshed","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-03 20:28:53.659618+00	
00000000-0000-0000-0000-000000000000	e77a3182-c39f-46c5-8992-b57891037f4a	{"action":"token_revoked","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-03 20:28:53.68436+00	
00000000-0000-0000-0000-000000000000	b1a51124-82df-4391-9d6b-d0f34568421f	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-03 21:36:29.714809+00	
00000000-0000-0000-0000-000000000000	baa35a74-c055-443e-9be3-c80b5d2f2060	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-03 21:36:29.732794+00	
00000000-0000-0000-0000-000000000000	8d3077b4-9d5c-4ace-ad94-9b8c172fedb2	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-04 01:46:02.008053+00	
00000000-0000-0000-0000-000000000000	ed9785b7-5efc-4d7c-9f87-6b2c1e08e868	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-04 02:41:34.928726+00	
00000000-0000-0000-0000-000000000000	6ea37170-4d1e-4c45-9c28-6c93f098876b	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-04 03:18:49.38756+00	
00000000-0000-0000-0000-000000000000	31e2d90d-1650-4989-b157-4fab1c89731a	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-04 03:20:27.817206+00	
00000000-0000-0000-0000-000000000000	28546cce-efc0-4097-9aad-90c6cc9bb105	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-04 05:32:42.208336+00	
00000000-0000-0000-0000-000000000000	059da72a-dd57-4d87-8817-4ccaa64f846b	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-04 05:32:42.236388+00	
00000000-0000-0000-0000-000000000000	1383e2e5-863d-47e8-a415-3030b40c2dc5	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-04 14:44:30.629879+00	
00000000-0000-0000-0000-000000000000	742882ff-ba90-4b24-8453-7847b9904c17	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-04 14:44:30.657931+00	
00000000-0000-0000-0000-000000000000	9237ae8d-6037-4405-a6dd-8df2883b75f4	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-04 15:13:54.470618+00	
00000000-0000-0000-0000-000000000000	817e887d-b84a-4f5c-b8e5-eff7677de557	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-04 15:13:54.485392+00	
00000000-0000-0000-0000-000000000000	183e0e7b-2081-4b57-8834-4256023d949e	{"action":"logout","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-04 15:14:05.525341+00	
00000000-0000-0000-0000-000000000000	43f090c2-8033-4291-9841-fe69ced61e8b	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-04 15:14:08.172565+00	
00000000-0000-0000-0000-000000000000	456bd36d-43a7-430e-b230-1cf7094a7631	{"action":"logout","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-04 15:14:15.435186+00	
00000000-0000-0000-0000-000000000000	a8f7ac86-668c-4d6d-90f5-5867c3af8b80	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-04 15:43:20.368831+00	
00000000-0000-0000-0000-000000000000	8a22cb58-2247-4634-af7b-3acd1af529e1	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-04 15:43:20.384423+00	
00000000-0000-0000-0000-000000000000	aabbbfcd-a2d3-49e8-b745-64f9c9933afe	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-04 20:21:37.425451+00	
00000000-0000-0000-0000-000000000000	2390c166-9b18-4cd1-af61-f378c2d285c3	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-04 20:21:37.452783+00	
00000000-0000-0000-0000-000000000000	f89e34fa-871b-479b-bfc4-829cb4bae0ec	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-04 22:20:29.116136+00	
00000000-0000-0000-0000-000000000000	ef7f2faa-262b-4c9e-9d04-04f89769e681	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-04 22:20:29.138137+00	
00000000-0000-0000-0000-000000000000	868b220b-8ead-42d2-9d32-61107205b7f2	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-04 22:22:17.869189+00	
00000000-0000-0000-0000-000000000000	c5b5e05e-cb0a-4d79-b353-3191fe0363e3	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-04 23:24:23.483881+00	
00000000-0000-0000-0000-000000000000	73b96b74-d52b-4556-8335-b5d29905dd21	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-04 23:24:23.501376+00	
00000000-0000-0000-0000-000000000000	94e3e795-7c45-481b-8be3-8063d7c48f0c	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-05 00:39:34.770312+00	
00000000-0000-0000-0000-000000000000	356d5d19-8b3c-4ea9-8992-1ef9ae205f1e	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-05 00:39:34.795222+00	
00000000-0000-0000-0000-000000000000	b65f8807-061d-452b-974a-671293ded384	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-05 00:40:13.680392+00	
00000000-0000-0000-0000-000000000000	3e87c80b-c213-4d98-b91a-82a0bc85bb8f	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-05 01:56:45.353372+00	
00000000-0000-0000-0000-000000000000	254753fa-f3cb-4f2c-ac03-50f4065d3fbf	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-05 01:56:45.361407+00	
00000000-0000-0000-0000-000000000000	5345735a-fb38-4a48-970a-cb7cc791f46b	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-05 13:55:25.760279+00	
00000000-0000-0000-0000-000000000000	5d08cd32-eaf3-4b56-83b6-6f06ec57b4bc	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-05 13:55:25.788575+00	
00000000-0000-0000-0000-000000000000	509c49e6-7e9c-4dbb-b419-2d3de7d54329	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-05 13:55:28.230595+00	
00000000-0000-0000-0000-000000000000	840f4cae-c578-40d8-8379-67d09261b858	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-05 14:00:46.301976+00	
00000000-0000-0000-0000-000000000000	97ddc930-c574-4eb2-a44a-fcf97fc2f810	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-05 15:00:13.351334+00	
00000000-0000-0000-0000-000000000000	dd2a99df-a845-4f4e-b9a5-ecba416a537f	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-05 15:00:13.375489+00	
00000000-0000-0000-0000-000000000000	cb24038d-30d6-47c5-bcea-61258d8841ad	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-05 15:10:48.865374+00	
00000000-0000-0000-0000-000000000000	ee1623d9-40a5-47da-94bb-d9c910601b75	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-05 15:29:01.236928+00	
00000000-0000-0000-0000-000000000000	c81c531b-dca3-43ff-a5f5-9cd1cb80c60d	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-05 15:29:06.881631+00	
00000000-0000-0000-0000-000000000000	dea11c5e-2218-453e-9883-cb5775286042	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-05 15:29:12.846396+00	
00000000-0000-0000-0000-000000000000	1a603b40-f5c4-4b0e-a20d-3ac645fe4f74	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-05 15:52:15.415974+00	
00000000-0000-0000-0000-000000000000	3fbc6dca-5298-4e6a-b3e5-104753e98f22	{"action":"token_refreshed","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-05 16:28:53.690153+00	
00000000-0000-0000-0000-000000000000	bcb41eb8-df0c-418f-a91e-20f7f441001c	{"action":"token_revoked","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-05 16:28:53.716897+00	
00000000-0000-0000-0000-000000000000	43524494-4bfc-43ac-8501-a07ca942ffd3	{"action":"login","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-05 16:29:24.81355+00	
00000000-0000-0000-0000-000000000000	cc431174-bb1c-4416-8a03-049d566ac150	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-05 17:42:30.370659+00	
00000000-0000-0000-0000-000000000000	facc631c-9a0b-45ff-92cd-a002373a442d	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-05 17:42:30.377011+00	
00000000-0000-0000-0000-000000000000	3a1e2cef-1997-40c7-b270-56e4608a51e1	{"action":"token_refreshed","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-05 17:52:22.202955+00	
00000000-0000-0000-0000-000000000000	06e2e053-4fdf-4a88-9c17-1413a2deb30a	{"action":"token_revoked","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-05 17:52:22.223286+00	
00000000-0000-0000-0000-000000000000	1bb316a2-9ebe-475b-8c4f-1dab44043b38	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-05 19:12:07.495391+00	
00000000-0000-0000-0000-000000000000	30e780ab-1b3b-45b7-baea-addd5a28d800	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-05 19:12:07.511545+00	
00000000-0000-0000-0000-000000000000	6ef9c4f5-ee08-4059-82b0-3a24579fe664	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-05 21:17:07.692476+00	
00000000-0000-0000-0000-000000000000	4b2d3d2c-70b1-4e41-892c-a27c33993f6b	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-05 21:17:07.713576+00	
00000000-0000-0000-0000-000000000000	67ddd9b6-4233-4282-abaf-29d869c230a0	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-06 00:17:24.985865+00	
00000000-0000-0000-0000-000000000000	2c7b2c23-759d-4823-b808-22b3232f81f1	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-06 00:17:28.428446+00	
00000000-0000-0000-0000-000000000000	3384acab-8b19-47e3-84e2-e9d179dbfcd0	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-06 00:25:50.658443+00	
00000000-0000-0000-0000-000000000000	c167d3d6-91d2-4d71-9075-52b8dc7465f1	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-06 00:25:50.664918+00	
00000000-0000-0000-0000-000000000000	343af33f-7801-4dac-83b4-a2c578cee4c3	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-06 01:26:03.104777+00	
00000000-0000-0000-0000-000000000000	df78d415-5ed8-49b4-bcdf-a08128dca994	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-06 01:26:03.119304+00	
00000000-0000-0000-0000-000000000000	d586b6bf-f5bd-4ca7-b39c-3a0fe8b9b1eb	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-06 11:35:09.143852+00	
00000000-0000-0000-0000-000000000000	c285058b-0c97-415c-a090-59f256081200	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-06 11:35:09.169745+00	
00000000-0000-0000-0000-000000000000	d2019477-62de-496e-b9fe-3d5c0dac8346	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-06 11:35:14.884984+00	
00000000-0000-0000-0000-000000000000	a3b71905-b4e7-48f9-8b3f-f3d4ecd3a20f	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-06 12:34:11.559037+00	
00000000-0000-0000-0000-000000000000	81914dfc-7c0a-4d93-b563-a91e46386293	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-06 12:34:11.575321+00	
00000000-0000-0000-0000-000000000000	f87c31a8-fd11-4638-bc95-73ad1882fec9	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-06 13:37:12.76734+00	
00000000-0000-0000-0000-000000000000	001a0c16-f87a-4275-86b1-7a483ff8660c	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-06 13:37:12.778479+00	
00000000-0000-0000-0000-000000000000	417dbe44-bbd6-4e34-afca-4e3383f3e6ae	{"action":"logout","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-06 13:45:13.486437+00	
00000000-0000-0000-0000-000000000000	2c8a2b36-698a-4760-9440-6bbbcea4783b	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-06 13:45:16.190242+00	
00000000-0000-0000-0000-000000000000	f540bdfb-3499-4f10-b5cd-a2412c70800b	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-06 14:47:00.208272+00	
00000000-0000-0000-0000-000000000000	4b41502c-01eb-49ee-ac4d-c4affcbaa83a	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-06 14:47:00.235852+00	
00000000-0000-0000-0000-000000000000	b7d50099-0d01-4a4c-9dc9-bebdedc432c9	{"action":"logout","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-06 14:47:51.095259+00	
00000000-0000-0000-0000-000000000000	45360b13-7ad2-4dc7-8f12-78340237ff2d	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-06 15:36:16.005694+00	
00000000-0000-0000-0000-000000000000	1d51c6e3-9320-47d1-852d-12e37bb6434d	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-06 22:22:51.406077+00	
00000000-0000-0000-0000-000000000000	67d00858-f799-4c5c-8325-71d0d726e294	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-06 22:22:51.426329+00	
00000000-0000-0000-0000-000000000000	1d5f9db3-6b87-4a1a-aad2-f139ea661e61	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-06 22:22:52.609767+00	
00000000-0000-0000-0000-000000000000	3789da9f-95ce-46dd-921c-9c218af848db	{"action":"token_refreshed","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-07 00:00:09.85187+00	
00000000-0000-0000-0000-000000000000	2080efc2-1eae-4d05-a745-417c71e82108	{"action":"token_revoked","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-07 00:00:09.862117+00	
00000000-0000-0000-0000-000000000000	84cdf222-3bca-4170-94f1-1014fd243688	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-07 00:00:34.671839+00	
00000000-0000-0000-0000-000000000000	1e871224-0b79-4617-aaf5-d134cf85c276	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-07 00:00:34.673145+00	
00000000-0000-0000-0000-000000000000	94a58a6c-af53-45b3-b077-dab778806394	{"action":"token_refreshed","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-07 20:10:21.974174+00	
00000000-0000-0000-0000-000000000000	71ef582b-cd93-4efe-a1e5-43342fbf3489	{"action":"login","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-07 20:10:39.31258+00	
00000000-0000-0000-0000-000000000000	6f63e7c0-d691-416a-ab9d-fc043f508961	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-08 01:00:54.077845+00	
00000000-0000-0000-0000-000000000000	43e3dd03-0bd3-48d3-8228-f92d49c03e17	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-08 01:00:54.105236+00	
00000000-0000-0000-0000-000000000000	951bd403-e393-4cd3-bc56-f12748783fa9	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-08 01:01:14.932979+00	
00000000-0000-0000-0000-000000000000	df1fcf06-f16d-4384-93a7-af6b6b347945	{"action":"logout","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-08 01:01:26.224923+00	
00000000-0000-0000-0000-000000000000	ad17b48f-3a48-4307-8753-99d5a9e4dd69	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-08 01:01:51.911081+00	
00000000-0000-0000-0000-000000000000	05c77a8d-af5d-413f-87cc-623cdfd9a019	{"action":"logout","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-08 01:24:15.318218+00	
00000000-0000-0000-0000-000000000000	91afd33c-25c1-4c94-b6a2-7bd1846be67d	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-08 01:28:03.037535+00	
00000000-0000-0000-0000-000000000000	7598ba76-1b7a-4ce2-9a27-6005e18022b9	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-08 01:47:12.548398+00	
00000000-0000-0000-0000-000000000000	cec3b034-81ea-45c1-8c9e-5b2cd2dae0f1	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-08 01:47:12.56493+00	
00000000-0000-0000-0000-000000000000	f685ae7e-4ade-43d0-82e0-bc4335fd1fc1	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-08 01:47:21.083674+00	
00000000-0000-0000-0000-000000000000	46fd68e0-f229-4b23-9d3b-6429731fff4c	{"action":"logout","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-08 01:51:15.216984+00	
00000000-0000-0000-0000-000000000000	732999fb-b568-48e1-8e9f-b3137fd79020	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-08 01:51:18.248272+00	
00000000-0000-0000-0000-000000000000	f303da0a-32c6-423c-87e0-bfe94fada04f	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-08 01:52:30.635028+00	
00000000-0000-0000-0000-000000000000	c9fe3e3a-d800-4f90-9676-a266d7654ff7	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-08 11:49:02.550147+00	
00000000-0000-0000-0000-000000000000	d18a3f8b-505a-4bfa-b1de-1f3185f2b5c2	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-08 11:49:02.576963+00	
00000000-0000-0000-0000-000000000000	ae01a76f-00ce-4d9b-9381-3a9161183e9e	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-10 08:17:44.542894+00	
00000000-0000-0000-0000-000000000000	2cd25589-e901-42bd-bc57-0f0263c029e7	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-10 08:17:44.571083+00	
00000000-0000-0000-0000-000000000000	c6f392e1-5a13-446c-8899-0ca974165afb	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-10 08:18:36.71156+00	
00000000-0000-0000-0000-000000000000	ebf0172f-1150-4a79-9287-b6ab4dcca636	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-10 08:56:13.08881+00	
00000000-0000-0000-0000-000000000000	0bec14c2-6956-415c-9a0b-ed1f1ea566cf	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-10 09:05:40.978489+00	
00000000-0000-0000-0000-000000000000	69442a5f-f5d9-405b-8c25-6d0b0b2ad482	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-10 10:35:22.876469+00	
00000000-0000-0000-0000-000000000000	7ae71563-ad47-454c-9c21-a7965696903e	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-10 10:35:22.900953+00	
00000000-0000-0000-0000-000000000000	6b59b79c-008e-4fd3-bdef-b6d45dbec7d6	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-10 12:18:54.069295+00	
00000000-0000-0000-0000-000000000000	7c51b37c-17b7-4dfa-bf75-8f46c9f01d74	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-10 12:18:54.080124+00	
00000000-0000-0000-0000-000000000000	8fa59618-fb83-41ab-862d-6cb63cdaa5b1	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-12 10:23:18.713326+00	
00000000-0000-0000-0000-000000000000	861d9316-fd8a-40b7-911f-7b8a1b1aa95c	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-12 10:23:18.735516+00	
00000000-0000-0000-0000-000000000000	cc24e5cd-271b-44cb-8701-e46df59ea416	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-12 10:24:05.596094+00	
00000000-0000-0000-0000-000000000000	54dd4d50-23fc-4245-949b-856207067360	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-17 05:02:29.3299+00	
00000000-0000-0000-0000-000000000000	964b0cc3-f1db-4b75-ac30-1a765d2b5e2c	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-17 05:02:29.358166+00	
00000000-0000-0000-0000-000000000000	25de1d26-7d59-41f4-a687-0a5037e6d13a	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-17 05:07:57.174822+00	
00000000-0000-0000-0000-000000000000	cac0565f-1777-4b07-a627-879dadeb0213	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-17 06:06:52.099848+00	
00000000-0000-0000-0000-000000000000	0ef17c6d-dce8-47a0-985f-5b2bf9245e5b	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-17 06:06:52.115632+00	
00000000-0000-0000-0000-000000000000	957059b9-e09c-4b87-b97c-3727dc1aba40	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-17 07:10:17.359948+00	
00000000-0000-0000-0000-000000000000	78dd4940-d12c-4db7-90b5-ade1f1f04213	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-17 07:10:17.394069+00	
00000000-0000-0000-0000-000000000000	004e83e6-1075-4900-92b5-9a3e83c71688	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-17 08:12:26.046636+00	
00000000-0000-0000-0000-000000000000	b5346914-9434-43d6-aa7e-a4ed79e427f2	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-17 08:12:26.074038+00	
00000000-0000-0000-0000-000000000000	6ffee9ea-da84-482e-ae72-acca22c645dd	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-17 08:48:48.7285+00	
00000000-0000-0000-0000-000000000000	12c64a69-e65d-46f6-a3cd-c3f248aaba7f	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-17 09:47:27.723407+00	
00000000-0000-0000-0000-000000000000	e6baac19-4cce-4ae8-8d17-62697d3ecaa1	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-17 09:47:27.748593+00	
00000000-0000-0000-0000-000000000000	97643c1f-2ec9-4eab-a35b-6c659aea5b11	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-17 12:08:22.348284+00	
00000000-0000-0000-0000-000000000000	34dd2fa0-a41e-4e7e-a106-4ff9ffa0277c	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-17 12:08:22.373967+00	
00000000-0000-0000-0000-000000000000	39915a9e-3cf6-4cbe-a633-180ef969f563	{"action":"logout","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-17 12:12:30.479356+00	
00000000-0000-0000-0000-000000000000	0246f06b-e14c-4cd3-8b61-2508be599462	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-17 12:13:10.212016+00	
00000000-0000-0000-0000-000000000000	3e64a227-ef5f-45a5-a587-208d3999190b	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-17 12:21:47.180329+00	
00000000-0000-0000-0000-000000000000	16006f86-af33-43f6-80d2-7ae6e5bf45d3	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-17 12:21:47.188912+00	
00000000-0000-0000-0000-000000000000	c16004bf-436c-481e-a37e-a074daa72172	{"action":"logout","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-17 12:32:10.824624+00	
00000000-0000-0000-0000-000000000000	0e7d8f72-b4e0-4e58-be71-37261a5909d9	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-17 13:24:43.858835+00	
00000000-0000-0000-0000-000000000000	f4647cf9-49a5-4e0c-8829-5634a2d9fd9b	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-17 13:24:43.886468+00	
00000000-0000-0000-0000-000000000000	f039e49d-b131-4a2c-b221-7caeccab2492	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-17 14:11:32.583884+00	
00000000-0000-0000-0000-000000000000	fbf5f800-7088-4bd1-a79a-b2109f3817a7	{"action":"token_refreshed","actor_id":"141b2519-daf3-4bf8-8dac-e97840181403","actor_username":"test_personal@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-17 14:15:04.404327+00	
00000000-0000-0000-0000-000000000000	71fb89de-45ce-4bb7-92f6-f46c8abf1188	{"action":"token_revoked","actor_id":"141b2519-daf3-4bf8-8dac-e97840181403","actor_username":"test_personal@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-17 14:15:04.406848+00	
00000000-0000-0000-0000-000000000000	4db06f82-0e75-46e9-8ede-e3270933df72	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-17 14:16:13.675138+00	
00000000-0000-0000-0000-000000000000	ec5cd2c4-4441-443f-86d0-31eea81b74e7	{"action":"token_refreshed","actor_id":"141b2519-daf3-4bf8-8dac-e97840181403","actor_username":"test_personal@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-17 15:47:35.335851+00	
00000000-0000-0000-0000-000000000000	4ad9c29c-5e4d-4515-8847-cfd82546e852	{"action":"token_revoked","actor_id":"141b2519-daf3-4bf8-8dac-e97840181403","actor_username":"test_personal@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-17 15:47:35.345154+00	
00000000-0000-0000-0000-000000000000	a7dd3b1c-616c-4b08-a761-a2b56473f5f2	{"action":"token_refreshed","actor_id":"141b2519-daf3-4bf8-8dac-e97840181403","actor_username":"test_personal@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-17 15:47:39.106187+00	
00000000-0000-0000-0000-000000000000	f9b74fbc-4ff3-46fb-b741-6435c614d92f	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-17 21:34:19.452305+00	
00000000-0000-0000-0000-000000000000	2df9038e-a308-49e4-b1da-02c15491be08	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-17 21:34:19.471981+00	
00000000-0000-0000-0000-000000000000	3c2ceff0-92b4-4c95-b03f-b1744d2ea2f1	{"action":"logout","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-17 21:34:33.966582+00	
00000000-0000-0000-0000-000000000000	1f2f201d-a40b-4fd3-9099-93614c873eeb	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-17 21:49:39.138326+00	
00000000-0000-0000-0000-000000000000	57d98eab-ec56-4530-99a5-5d62a7423256	{"action":"token_refreshed","actor_id":"6461c7bb-99f6-4e74-9ade-5b4219d70c12","actor_username":"admin12@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-17 23:01:20.417177+00	
00000000-0000-0000-0000-000000000000	0cd2d3c1-bbb2-42f2-977e-481585edd6c7	{"action":"token_revoked","actor_id":"6461c7bb-99f6-4e74-9ade-5b4219d70c12","actor_username":"admin12@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-17 23:01:20.438753+00	
00000000-0000-0000-0000-000000000000	147b83ab-7cf4-454c-8e71-ec13e0e9beef	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-18 00:04:22.243215+00	
00000000-0000-0000-0000-000000000000	11ffefcf-b189-4bee-b958-3f614c045765	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-18 00:04:29.40258+00	
00000000-0000-0000-0000-000000000000	2e762d34-4889-4509-b007-037a71b88646	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-18 00:04:46.325449+00	
00000000-0000-0000-0000-000000000000	e9742f7c-7c55-4461-a7ac-49bd8ac1b96c	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-18 00:37:32.07939+00	
00000000-0000-0000-0000-000000000000	2d1921ef-9e8c-4a90-94f0-da4790b4fedd	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-18 00:37:32.114871+00	
00000000-0000-0000-0000-000000000000	08335504-4333-4e2c-96a8-2b37b37b9115	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-18 00:37:57.625498+00	
00000000-0000-0000-0000-000000000000	abac2335-b578-4ae5-8e7d-90af85e7c620	{"action":"logout","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-18 00:38:06.704016+00	
00000000-0000-0000-0000-000000000000	ba3341e8-7e4f-4dcf-b9b7-cb5a34b36693	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-18 00:38:15.399765+00	
00000000-0000-0000-0000-000000000000	3928a9aa-5f40-4335-b24a-424fa0385830	{"action":"logout","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-18 00:42:06.651237+00	
00000000-0000-0000-0000-000000000000	caa37844-5a63-44d6-b33c-7f022cd18382	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-18 01:10:41.195105+00	
00000000-0000-0000-0000-000000000000	164f0a34-2566-41df-9961-7c7c2b628bf4	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-18 01:10:41.201115+00	
00000000-0000-0000-0000-000000000000	bed8659d-032a-487b-87dd-0e7a325334ab	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-18 02:10:15.521225+00	
00000000-0000-0000-0000-000000000000	a4b84a24-878b-41fa-ac29-81b0cc111d68	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-18 02:10:15.544874+00	
00000000-0000-0000-0000-000000000000	0937c69c-7168-4747-af88-fb3354528aa4	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-18 03:10:30.712965+00	
00000000-0000-0000-0000-000000000000	66de5813-2baf-495b-be80-3aa2193fac16	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-18 03:10:30.734858+00	
00000000-0000-0000-0000-000000000000	3f8067b3-b801-4c01-bda5-79461487198f	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-18 04:39:53.932913+00	
00000000-0000-0000-0000-000000000000	be4f1c3a-9c28-42bc-b47c-89b1756a9cdf	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-18 04:39:53.943106+00	
00000000-0000-0000-0000-000000000000	3f29da1e-f3bf-4b82-8fc4-5a7573022a07	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-18 07:41:02.554109+00	
00000000-0000-0000-0000-000000000000	f837c5b8-a1ab-4765-a51f-e0745d344a22	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-18 07:41:02.58145+00	
00000000-0000-0000-0000-000000000000	e38e740a-58d0-44ec-bdfd-31d25b58ae6f	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-18 08:43:18.959887+00	
00000000-0000-0000-0000-000000000000	a19eaa0c-84d1-4d6a-b0e2-54307cdeafbe	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-18 08:43:18.976652+00	
00000000-0000-0000-0000-000000000000	a532a98a-b88e-4aa7-94e7-fac3090d5de2	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-18 13:04:04.915824+00	
00000000-0000-0000-0000-000000000000	09e08fac-db42-4cf7-ac0d-212db471bfa6	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-18 13:04:04.937783+00	
00000000-0000-0000-0000-000000000000	a3cd1f72-e7fd-43e3-81f1-d06e8e410122	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-18 14:07:33.588991+00	
00000000-0000-0000-0000-000000000000	1032802a-6651-4cf7-a3c4-bd7097fa861d	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-18 14:07:33.600529+00	
00000000-0000-0000-0000-000000000000	14e48661-b687-42a6-b5e2-98bc33584032	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-18 14:11:10.25082+00	
00000000-0000-0000-0000-000000000000	a594bbbc-3a99-433e-9e7a-42003545b5e9	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-18 15:12:04.778359+00	
00000000-0000-0000-0000-000000000000	881645a9-de73-49c9-a5aa-014e2b75ad4d	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-18 15:12:04.803858+00	
00000000-0000-0000-0000-000000000000	cee815cf-1c5c-4372-84de-ac8cbea4e50c	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-18 15:12:04.907545+00	
00000000-0000-0000-0000-000000000000	5a4945cb-3355-4f86-a906-b1b458b629ca	{"action":"logout","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-18 15:41:02.66261+00	
00000000-0000-0000-0000-000000000000	1c2da697-3291-40e0-9c81-2115d6bd1801	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-18 15:41:53.94679+00	
00000000-0000-0000-0000-000000000000	13e78f6e-9e79-4072-b706-af156256dc2d	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-18 16:59:17.468217+00	
00000000-0000-0000-0000-000000000000	ec6bc11d-e998-4467-ac26-9b81efffab5b	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-18 16:59:17.479347+00	
00000000-0000-0000-0000-000000000000	36f8a6e2-cf48-4c62-af9a-8fe64144f38e	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-18 17:16:21.771396+00	
00000000-0000-0000-0000-000000000000	46f11927-4a1d-4f1d-91ec-4ff67511b2ca	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-18 18:16:48.202428+00	
00000000-0000-0000-0000-000000000000	05683157-2b71-4404-b1e5-43b785be010e	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-18 18:16:48.232355+00	
00000000-0000-0000-0000-000000000000	77fa4ad8-d33e-4ebe-9c98-58a6ac69f7ed	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-18 21:13:23.642552+00	
00000000-0000-0000-0000-000000000000	c510381e-c8d1-4d49-ba52-5202e580f504	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-18 23:24:25.597237+00	
00000000-0000-0000-0000-000000000000	c698b631-e0d9-4759-a8ca-cf85dc588c31	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-18 23:24:25.610226+00	
00000000-0000-0000-0000-000000000000	859078fd-c15c-431e-a377-e10f17c1ab68	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-18 23:27:33.093486+00	
00000000-0000-0000-0000-000000000000	1a07e49c-50dd-49e1-9577-c63f601d8065	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-19 05:19:56.98321+00	
00000000-0000-0000-0000-000000000000	807c8771-e871-473e-b398-cf0bb98b69b1	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-19 05:19:57.00781+00	
00000000-0000-0000-0000-000000000000	30a7cd4d-1580-4bf6-8e53-c1828d8d9dda	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-21 00:06:29.935053+00	
00000000-0000-0000-0000-000000000000	b32fc952-7b06-462d-8efe-ed84265ad63e	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-21 00:06:29.964013+00	
00000000-0000-0000-0000-000000000000	0c6f359c-0b5a-44b6-92aa-821ab5502d59	{"action":"token_refreshed","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-21 21:55:16.001681+00	
00000000-0000-0000-0000-000000000000	e25d794f-f4bb-4644-82ca-00ed54231546	{"action":"token_revoked","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-21 21:55:16.02804+00	
00000000-0000-0000-0000-000000000000	a18eaf50-3657-4914-b391-c9a8b2dead93	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-21 22:52:09.873638+00	
00000000-0000-0000-0000-000000000000	2b768a0b-9f72-458d-b4ee-bd3a151e6ef9	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-21 22:52:13.382246+00	
00000000-0000-0000-0000-000000000000	296b60c8-84e7-4df0-a267-7234874f6322	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-21 22:54:25.096515+00	
00000000-0000-0000-0000-000000000000	7b9548de-5ac6-46d1-8045-5d617941cc44	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-21 22:54:25.104247+00	
00000000-0000-0000-0000-000000000000	25f29846-c369-45a5-a66c-ef1b4f01df61	{"action":"logout","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-21 22:54:52.635342+00	
00000000-0000-0000-0000-000000000000	02abf297-3c88-4e65-9a94-30e7900c5c8e	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-21 22:54:58.816021+00	
00000000-0000-0000-0000-000000000000	8f0624b1-39da-4476-b299-126a5af3d109	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-21 22:55:03.34749+00	
00000000-0000-0000-0000-000000000000	9c229e6c-b838-49a5-8120-5fc4792d8066	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-21 22:55:04.380459+00	
00000000-0000-0000-0000-000000000000	5a04f19d-3b0f-4685-a5d0-74a5c3f54947	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-21 22:55:05.334535+00	
00000000-0000-0000-0000-000000000000	955dc835-7bff-4e95-a5fc-74954bd254b8	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-21 22:55:25.021888+00	
00000000-0000-0000-0000-000000000000	fab540c6-3756-42af-80b4-3406c3b27d28	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-21 22:55:30.613313+00	
00000000-0000-0000-0000-000000000000	4772c123-7270-46a4-9aa3-1ed8d2741b0d	{"action":"logout","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-21 23:19:23.018644+00	
00000000-0000-0000-0000-000000000000	e683b5a0-c2e6-49aa-9581-1c083a9a49ed	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-21 23:19:32.692353+00	
00000000-0000-0000-0000-000000000000	99864ade-662b-4644-b032-5e798e1d1a4e	{"action":"logout","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-21 23:20:14.162952+00	
00000000-0000-0000-0000-000000000000	d1e74b25-3bae-48b7-a607-68684129db05	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-21 23:22:43.102627+00	
00000000-0000-0000-0000-000000000000	d0e8f709-5a5c-4d9d-9f55-92c1b35b0bba	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-21 23:22:45.737207+00	
00000000-0000-0000-0000-000000000000	733dc5b1-0b1f-4cfe-b27e-5a9758592bc1	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-21 23:22:46.813315+00	
00000000-0000-0000-0000-000000000000	ea762bf4-0c36-4331-86d9-a5480570bc7b	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-21 23:22:47.285231+00	
00000000-0000-0000-0000-000000000000	50f898ab-0026-43f4-825e-cbc02cdde3e5	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-21 23:22:48.270262+00	
00000000-0000-0000-0000-000000000000	0b75b137-a90b-40ac-b827-47991b77024c	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-21 23:23:01.212778+00	
00000000-0000-0000-0000-000000000000	5e39f82f-a1ee-4eb3-a5d9-77aca6907dff	{"action":"logout","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-21 23:48:11.60131+00	
00000000-0000-0000-0000-000000000000	a0ca226d-c416-461a-81d7-9eb1ed721623	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-21 23:48:14.931361+00	
00000000-0000-0000-0000-000000000000	68cf9402-5791-4096-ac5b-53a165861ae2	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-21 23:48:19.300346+00	
00000000-0000-0000-0000-000000000000	48be13bf-7bdd-45bf-a366-1bcdf6162aa3	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-21 23:48:59.778863+00	
00000000-0000-0000-0000-000000000000	142a25e4-6bdc-4982-ae33-d57d10881a48	{"action":"logout","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-21 23:50:18.977511+00	
00000000-0000-0000-0000-000000000000	a0bd1d97-c4b5-4717-b882-5218f889c7cc	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-21 23:50:21.123077+00	
00000000-0000-0000-0000-000000000000	21b9a047-6213-4094-9d41-fdec3c100927	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-22 00:09:44.793614+00	
00000000-0000-0000-0000-000000000000	f0eb3367-6edf-4f82-b3c3-3a602e55007a	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-22 00:14:59.147135+00	
00000000-0000-0000-0000-000000000000	599f5d3f-2ae5-4a20-9118-1d7e0f428db2	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-22 00:14:59.153777+00	
00000000-0000-0000-0000-000000000000	d302e5c4-fd0c-4fa9-ae60-8d7078504d62	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-22 00:15:04.146583+00	
00000000-0000-0000-0000-000000000000	b736fd04-3ee9-4669-8c1c-42c6093671d7	{"action":"logout","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-22 00:15:09.46577+00	
00000000-0000-0000-0000-000000000000	eb5f3c16-cbdb-47ff-94eb-c5e5e41580ff	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-22 00:15:11.368555+00	
00000000-0000-0000-0000-000000000000	1f4f2aca-dc11-4c9d-8c0f-603e297a57f2	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-22 00:49:35.400615+00	
00000000-0000-0000-0000-000000000000	0f48862f-36d0-4177-b5a8-4c11263592fb	{"action":"logout","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-22 01:00:43.756004+00	
00000000-0000-0000-0000-000000000000	ac7a172c-ad24-4355-ac91-db7d2d9b97b5	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-22 01:00:57.179037+00	
00000000-0000-0000-0000-000000000000	6d697727-ca29-4f40-ae89-015251b72424	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-22 02:03:09.351588+00	
00000000-0000-0000-0000-000000000000	099466c2-d04a-401d-80d9-a7422eeeb6bb	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-22 02:03:09.376949+00	
00000000-0000-0000-0000-000000000000	3341d4f4-c2dc-4f22-97dc-61e10868d736	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-22 02:03:09.459961+00	
00000000-0000-0000-0000-000000000000	790697fb-0c4d-47ac-b2a2-095a04806f71	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 04:15:17.85015+00	
00000000-0000-0000-0000-000000000000	07972dc6-94af-4050-aaf8-b87159663df9	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 04:15:17.876517+00	
00000000-0000-0000-0000-000000000000	9c94000a-e507-4446-af0d-d1e06f28c987	{"action":"logout","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-23 04:16:03.19398+00	
00000000-0000-0000-0000-000000000000	969028e6-7ff8-44ec-9c30-de0dc12dd867	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-23 04:16:14.770924+00	
00000000-0000-0000-0000-000000000000	1048f505-b7b9-4c32-87b0-2bb436da74c1	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 05:14:55.241823+00	
00000000-0000-0000-0000-000000000000	39170c83-ff0c-42db-b8da-cd636195fd6c	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 05:14:55.258745+00	
00000000-0000-0000-0000-000000000000	5e73b3a5-be96-4179-b35f-6f5ace2ff722	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 05:27:58.913796+00	
00000000-0000-0000-0000-000000000000	7d490672-3d6d-4e2b-a65c-b478810ce650	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 05:27:58.929005+00	
00000000-0000-0000-0000-000000000000	98c86c26-1a6e-4419-a428-cbda33bdf65d	{"action":"logout","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-23 05:28:07.830519+00	
00000000-0000-0000-0000-000000000000	b5b69f81-c5e6-4540-b5e4-a566ebeae5ba	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-23 05:28:09.474012+00	
00000000-0000-0000-0000-000000000000	974ba84f-fb62-4774-a25d-812118a9dc3a	{"action":"logout","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-23 05:28:52.837851+00	
00000000-0000-0000-0000-000000000000	1e7974d0-a855-463a-9c7f-d007672b73fc	{"action":"logout","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-23 05:28:56.348839+00	
00000000-0000-0000-0000-000000000000	163f5175-b0ec-4db4-8a53-02595ba1e808	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-23 05:39:23.462586+00	
00000000-0000-0000-0000-000000000000	6b36428e-4cee-41ea-9ca6-1886c187394f	{"action":"logout","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-23 05:44:55.092003+00	
00000000-0000-0000-0000-000000000000	7c2bdb30-2b9e-451f-b4b3-40250949692f	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-23 05:45:59.867092+00	
00000000-0000-0000-0000-000000000000	6f219baa-1fbf-4faf-92f1-1b06b5986a8d	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 06:44:17.21655+00	
00000000-0000-0000-0000-000000000000	8bd4792e-5fe4-4bfb-8914-d65650a588f8	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 06:44:17.251434+00	
00000000-0000-0000-0000-000000000000	f4d3fec7-8baf-4e6d-8d01-7173e668bd70	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 06:44:31.512147+00	
00000000-0000-0000-0000-000000000000	6daf63a3-2a5c-4eb2-8766-6dd7c9c0c0b4	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 06:44:31.530639+00	
00000000-0000-0000-0000-000000000000	d4c122cb-5b29-41ac-b7d5-8fa3a0e3b7cc	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 06:44:31.877916+00	
00000000-0000-0000-0000-000000000000	9db756ed-a715-4190-902a-46ca45912037	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 06:44:31.913075+00	
00000000-0000-0000-0000-000000000000	555bef2e-cbbf-4987-a02d-83f354e5db4c	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 06:44:32.22323+00	
00000000-0000-0000-0000-000000000000	1ab9f24a-0b46-45f0-9beb-ee7224d507c0	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 06:44:32.26595+00	
00000000-0000-0000-0000-000000000000	ddc482cc-dda8-47b4-bd3f-83c2773bd313	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 06:44:40.356665+00	
00000000-0000-0000-0000-000000000000	6515af35-9e2c-4afe-81ce-5121f27cd24f	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 06:44:40.38977+00	
00000000-0000-0000-0000-000000000000	2669f901-bd5f-4c19-9d7c-62897a39b88e	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 06:44:40.507353+00	
00000000-0000-0000-0000-000000000000	074090c9-2736-43eb-b32c-2b0ba394f5ad	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 06:44:40.536903+00	
00000000-0000-0000-0000-000000000000	7dbbe4fa-4228-46d4-90e7-40f260f0a53d	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 06:44:40.699674+00	
00000000-0000-0000-0000-000000000000	1783133b-0f4a-4dba-91ff-6ca4977d8faa	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 06:44:40.746481+00	
00000000-0000-0000-0000-000000000000	e6317afc-e075-4483-82b2-e74d4852464c	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 06:44:41.358762+00	
00000000-0000-0000-0000-000000000000	0efd1871-ac5c-4c38-accf-efc66df055e2	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 06:44:41.50353+00	
00000000-0000-0000-0000-000000000000	b9c152e7-d8cb-4eb3-a667-ca8d264a884b	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 06:44:41.785655+00	
00000000-0000-0000-0000-000000000000	d2e5e951-e3ce-4ef2-881d-da90f07ee53d	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 06:44:41.96909+00	
00000000-0000-0000-0000-000000000000	b15a216a-70ce-4000-bedd-f822d0197cbe	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 06:44:42.182526+00	
00000000-0000-0000-0000-000000000000	5fef0105-7dc7-4e4f-803e-bb7c94d043c5	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 06:44:47.342265+00	
00000000-0000-0000-0000-000000000000	7e914e53-04bc-4e4b-977c-266f34df2e1b	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 06:44:54.48143+00	
00000000-0000-0000-0000-000000000000	58142ce7-4664-4f42-88c5-fd71e2170a5b	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 06:44:54.805516+00	
00000000-0000-0000-0000-000000000000	64efd2f8-2d23-4abc-a6d4-f2420b14d450	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 06:44:54.952986+00	
00000000-0000-0000-0000-000000000000	5bcd2af4-7150-43a2-b370-bafdcbed9a2a	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 06:44:54.961+00	
00000000-0000-0000-0000-000000000000	a36f9c51-9291-4ecb-9ebf-1853154a0b1c	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 06:44:55.0076+00	
00000000-0000-0000-0000-000000000000	ba0fab9f-1ab7-4223-9882-83bdb02b4056	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 06:44:55.167067+00	
00000000-0000-0000-0000-000000000000	dfe08661-1359-463e-98ad-6923a03985ce	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 06:44:55.651524+00	
00000000-0000-0000-0000-000000000000	d79c8c60-03fd-4a36-b785-60244e124e0f	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 06:44:55.791829+00	
00000000-0000-0000-0000-000000000000	1048831c-b1ce-4a08-a143-00975df8fb28	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 06:44:56.40963+00	
00000000-0000-0000-0000-000000000000	a4b0717b-802c-4b7e-be60-c58b6843a2e7	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 06:44:56.518304+00	
00000000-0000-0000-0000-000000000000	f2e7647b-375b-4019-b648-f05ec4ad4207	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 06:44:56.541791+00	
00000000-0000-0000-0000-000000000000	581c4910-264b-477a-84a2-29b3feeb1c20	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 06:44:56.776453+00	
00000000-0000-0000-0000-000000000000	5a190bf7-2824-497d-9e94-02eb0b9ea53c	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 06:44:57.027513+00	
00000000-0000-0000-0000-000000000000	7846dd1c-d3b7-4ad1-87ee-10f07302b68a	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-23 07:05:35.29583+00	
00000000-0000-0000-0000-000000000000	b55c1a83-efa8-406e-bd38-594c3aa92b97	{"action":"logout","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-23 07:06:15.304634+00	
00000000-0000-0000-0000-000000000000	2f47310c-65ae-41d2-b033-9cf518339a80	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-23 07:10:09.038693+00	
00000000-0000-0000-0000-000000000000	4301600b-741b-48ff-ba4d-41f8a8758576	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 16:31:35.157816+00	
00000000-0000-0000-0000-000000000000	86697011-d2a8-4e00-9c2a-d36faaf6f53b	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 16:31:35.183153+00	
00000000-0000-0000-0000-000000000000	4306073a-08f2-4242-b721-dc9453b673aa	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 16:31:35.266827+00	
00000000-0000-0000-0000-000000000000	986d00fb-e545-4757-b914-3d2fe8752957	{"action":"logout","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-23 16:32:26.005847+00	
00000000-0000-0000-0000-000000000000	9daf2764-8de4-4ed4-8a15-c49cbb831b2d	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-23 16:33:00.045057+00	
00000000-0000-0000-0000-000000000000	14a5b7cc-f3e9-4aac-8405-8bc1a368d7c4	{"action":"logout","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-23 16:33:30.40128+00	
00000000-0000-0000-0000-000000000000	a510132c-da9d-4b29-bfb4-dbbbf6b771b7	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-23 16:34:06.228937+00	
00000000-0000-0000-0000-000000000000	4a17371a-a611-4e5f-817c-e7e4b9b3114f	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-23 16:34:08.166116+00	
00000000-0000-0000-0000-000000000000	d8a644e4-7fd9-4b22-b1ad-654d12efbd27	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-23 16:34:10.174829+00	
00000000-0000-0000-0000-000000000000	d70c10e7-f76e-4013-b08c-20a42e579f5a	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-23 16:34:15.333899+00	
00000000-0000-0000-0000-000000000000	0f88f756-8c0b-4697-8e1f-c4b5feeec53b	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-23 16:34:16.129557+00	
00000000-0000-0000-0000-000000000000	c7649ca9-5541-4c50-b025-d3af0e7298d2	{"action":"token_refreshed","actor_id":"141b2519-daf3-4bf8-8dac-e97840181403","actor_username":"test_personal@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 17:25:32.816026+00	
00000000-0000-0000-0000-000000000000	38bb9c67-5afa-4c7d-b5d6-e2cd89a49cf6	{"action":"token_revoked","actor_id":"141b2519-daf3-4bf8-8dac-e97840181403","actor_username":"test_personal@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 17:25:32.830339+00	
00000000-0000-0000-0000-000000000000	45cd35d0-6a82-486d-8205-a10b381a3e92	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 17:32:50.245205+00	
00000000-0000-0000-0000-000000000000	f6234651-fff6-4460-8988-867752343879	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 17:32:50.25325+00	
00000000-0000-0000-0000-000000000000	91a44f32-927c-4f83-b4ba-2623c049d0ff	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 18:31:42.009202+00	
00000000-0000-0000-0000-000000000000	8d0a24b7-9f97-4391-825f-6c2939537197	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-23 18:31:42.02542+00	
00000000-0000-0000-0000-000000000000	4dfe7d9d-7aed-41ab-b4d9-39e7580797ef	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-23 18:43:51.201536+00	
00000000-0000-0000-0000-000000000000	2edfaa4c-8734-4703-9ec4-b2ca71346062	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-23 23:34:01.571836+00	
00000000-0000-0000-0000-000000000000	852be864-8e74-44f9-ad7d-fe3d0ec53c50	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-24 00:15:07.769009+00	
00000000-0000-0000-0000-000000000000	ae268e5b-5d27-4321-a4ec-19b9e01d470a	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-24 00:15:07.801245+00	
00000000-0000-0000-0000-000000000000	8655854d-e2a8-4437-a20a-ad9d8dfbabe8	{"action":"token_refreshed","actor_id":"6461c7bb-99f6-4e74-9ade-5b4219d70c12","actor_username":"admin12@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-24 00:24:31.215758+00	
00000000-0000-0000-0000-000000000000	9060fe6e-f9c9-4cbb-a2d3-623e83b1909d	{"action":"token_revoked","actor_id":"6461c7bb-99f6-4e74-9ade-5b4219d70c12","actor_username":"admin12@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-24 00:24:31.224979+00	
00000000-0000-0000-0000-000000000000	e4626764-f3a6-4a3f-a77d-bc508751d0df	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-24 00:48:02.20887+00	
00000000-0000-0000-0000-000000000000	8e8cb48f-e690-49e9-a998-89eb53be71b1	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-24 00:48:02.22657+00	
00000000-0000-0000-0000-000000000000	22be6969-2816-4daa-8a25-99aa6137c1e9	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-24 01:36:42.039762+00	
00000000-0000-0000-0000-000000000000	24351d4b-757f-4375-af09-27657d1f4c8b	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-24 03:41:01.095126+00	
00000000-0000-0000-0000-000000000000	70f18b26-fe3e-4f63-9d6d-36b02f8eb064	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-24 03:41:01.121288+00	
00000000-0000-0000-0000-000000000000	46be0741-5f72-4d10-a407-b6bcf7a07b28	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-24 03:42:04.448107+00	
00000000-0000-0000-0000-000000000000	4a3959bd-accb-4a91-8503-b04939708b8b	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-24 04:01:31.375698+00	
00000000-0000-0000-0000-000000000000	af29e64d-c745-493d-be74-c6fe2280e826	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-24 05:01:47.760121+00	
00000000-0000-0000-0000-000000000000	8b51ab94-890c-409f-8487-5ff6fa4f7dbb	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-24 05:01:47.785869+00	
00000000-0000-0000-0000-000000000000	8b4d4ab0-ce69-47a8-a1a9-dd4047b57377	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-24 05:58:18.494676+00	
00000000-0000-0000-0000-000000000000	cebb309f-bf61-4ca7-a5c5-2f0e47ff01be	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-24 07:31:35.886853+00	
00000000-0000-0000-0000-000000000000	1e80fb2a-61d1-4933-8a83-01419cd6708c	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-24 07:31:35.91291+00	
00000000-0000-0000-0000-000000000000	24f34a12-4af4-4647-91dd-2d1a8d2b8366	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-24 07:31:57.192292+00	
00000000-0000-0000-0000-000000000000	155355b5-9fab-46ca-b7c4-b5a18ed0a674	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-24 08:02:00.914135+00	
00000000-0000-0000-0000-000000000000	28a7580a-1631-43ab-a369-e71547279bcd	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-24 09:06:19.084979+00	
00000000-0000-0000-0000-000000000000	0d0ffc92-e4fc-40e7-aa30-2bffc490a617	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-24 09:06:19.099413+00	
00000000-0000-0000-0000-000000000000	d2882b5b-badb-4585-b5d9-5577ba980a3c	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-24 09:06:20.885523+00	
00000000-0000-0000-0000-000000000000	2a23306c-1f03-4254-ada6-1d29ab4cc01f	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-24 09:55:41.143553+00	
00000000-0000-0000-0000-000000000000	18822225-d9f8-4859-90c2-594f870ae398	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-24 15:19:05.112741+00	
00000000-0000-0000-0000-000000000000	f9949253-12cf-4103-8c29-ab6f10a6c354	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-24 15:19:05.128507+00	
00000000-0000-0000-0000-000000000000	0a95d7bb-32f4-4215-93cb-e41727e9dd85	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-24 15:19:42.614568+00	
00000000-0000-0000-0000-000000000000	bfba00a1-d620-4002-8c68-c06d6c7b36ae	{"action":"token_refreshed","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-24 15:25:56.504968+00	
00000000-0000-0000-0000-000000000000	54250793-afe4-4a3b-bd08-83f0cdf8337c	{"action":"token_refreshed","actor_id":"6461c7bb-99f6-4e74-9ade-5b4219d70c12","actor_username":"admin12@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-24 15:31:21.115356+00	
00000000-0000-0000-0000-000000000000	1760b479-edb4-44fe-b3c8-d051636ba3f2	{"action":"token_revoked","actor_id":"6461c7bb-99f6-4e74-9ade-5b4219d70c12","actor_username":"admin12@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-24 15:31:21.135975+00	
00000000-0000-0000-0000-000000000000	2d40ec9c-2866-48e4-a6aa-10a091a3adf0	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-24 16:17:48.797414+00	
00000000-0000-0000-0000-000000000000	3f8f63c2-8c85-44be-a70a-33420ddf7c7b	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-24 16:17:48.819318+00	
00000000-0000-0000-0000-000000000000	4b4eadb7-7159-4169-b9ee-32feecf4b3df	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-24 17:48:57.744805+00	
00000000-0000-0000-0000-000000000000	e5cc63d2-e33e-40e0-beb4-942c8360e09b	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-24 17:48:57.770142+00	
00000000-0000-0000-0000-000000000000	d36b4281-0dda-408f-8ba6-b0463631a68c	{"action":"logout","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-24 17:50:34.011072+00	
00000000-0000-0000-0000-000000000000	03714e61-bc25-4977-8da1-2168fdea89a8	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-24 17:50:48.228827+00	
00000000-0000-0000-0000-000000000000	aa29d657-79ad-4ca7-bc25-bccd7d85bd5c	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-24 17:51:32.36767+00	
00000000-0000-0000-0000-000000000000	3b45942b-5832-43df-a144-4c1a99d95858	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-24 17:51:32.368897+00	
00000000-0000-0000-0000-000000000000	4348b9d6-d259-42f3-8afa-0a6eb2dc2016	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-24 17:53:46.451449+00	
00000000-0000-0000-0000-000000000000	28441f10-2dc3-46ab-84fc-3f62a94d3fe0	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-24 17:53:46.452837+00	
00000000-0000-0000-0000-000000000000	b1db3a0b-d4f3-4430-a3f4-44a99c167492	{"action":"logout","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-24 17:59:00.654774+00	
00000000-0000-0000-0000-000000000000	ebe0aaac-8ec9-4fe7-8a90-e03a758c13fb	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-24 18:00:57.472402+00	
00000000-0000-0000-0000-000000000000	b1233bac-c9ed-4149-af89-0af8a8c43bb4	{"action":"token_refreshed","actor_id":"6461c7bb-99f6-4e74-9ade-5b4219d70c12","actor_username":"admin12@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-24 18:14:35.291411+00	
00000000-0000-0000-0000-000000000000	003e61fb-029b-4ca8-be6c-d2fcb8428bd7	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-24 20:07:48.478827+00	
00000000-0000-0000-0000-000000000000	6333b7df-fda3-4448-8cbc-87fced936f08	{"action":"logout","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-24 20:20:56.709789+00	
00000000-0000-0000-0000-000000000000	9346e3c5-4643-4391-a0cc-71a3a2706f95	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-24 20:21:47.098651+00	
00000000-0000-0000-0000-000000000000	07547051-894a-441d-a0e3-ae3f5836fbdf	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-24 20:22:06.625238+00	
00000000-0000-0000-0000-000000000000	01aa1f1b-25c0-4041-ac0f-f466603f295a	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-24 20:22:06.627267+00	
00000000-0000-0000-0000-000000000000	09c8ff43-39aa-4514-bc94-6be83f80eae2	{"action":"logout","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-24 20:23:25.758537+00	
00000000-0000-0000-0000-000000000000	d4b60112-297a-4203-b3ae-e90992b49fb0	{"action":"token_refreshed","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-24 22:43:19.682875+00	
00000000-0000-0000-0000-000000000000	64742d5d-b092-42ce-9734-02bf49e45f95	{"action":"token_revoked","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-24 22:43:19.713397+00	
00000000-0000-0000-0000-000000000000	8dbaf262-bd2a-4c8b-a9aa-a5be26cec9e4	{"action":"token_refreshed","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-25 15:00:49.970747+00	
00000000-0000-0000-0000-000000000000	48110c76-1029-41a9-b170-a4f1ef3284b3	{"action":"token_revoked","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-25 15:00:49.993874+00	
00000000-0000-0000-0000-000000000000	b0c8a4d6-8ca2-4933-a577-0b3031b263e0	{"action":"token_refreshed","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-26 01:03:28.346489+00	
00000000-0000-0000-0000-000000000000	ba0ea32a-678c-4cf1-98d8-52538b0cb072	{"action":"token_refreshed","actor_id":"6461c7bb-99f6-4e74-9ade-5b4219d70c12","actor_username":"admin12@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-26 01:51:01.784749+00	
00000000-0000-0000-0000-000000000000	065cea0e-8e34-45cb-bac7-401ef5fb8f46	{"action":"token_revoked","actor_id":"6461c7bb-99f6-4e74-9ade-5b4219d70c12","actor_username":"admin12@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-26 01:51:01.815628+00	
00000000-0000-0000-0000-000000000000	8443e608-c6af-4452-be9f-65ae677c823a	{"action":"token_refreshed","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-26 17:07:40.555581+00	
00000000-0000-0000-0000-000000000000	03766fec-3b27-4913-8ddd-6ec14ad0608e	{"action":"token_revoked","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-26 17:07:40.586548+00	
00000000-0000-0000-0000-000000000000	a878ac2f-06b2-4231-ae67-a666e7498bb2	{"action":"token_refreshed","actor_id":"141b2519-daf3-4bf8-8dac-e97840181403","actor_username":"test_personal@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-26 17:36:10.457569+00	
00000000-0000-0000-0000-000000000000	3aa9d433-fc53-4c57-8c2a-2a740491c401	{"action":"token_revoked","actor_id":"141b2519-daf3-4bf8-8dac-e97840181403","actor_username":"test_personal@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-26 17:36:10.473314+00	
00000000-0000-0000-0000-000000000000	c8d7134a-9f0c-483c-be9c-e8ef6784b916	{"action":"token_refreshed","actor_id":"6461c7bb-99f6-4e74-9ade-5b4219d70c12","actor_username":"admin12@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-27 01:12:37.352604+00	
00000000-0000-0000-0000-000000000000	02cb8825-2d99-4c76-a9fd-385b07daf2e7	{"action":"token_revoked","actor_id":"6461c7bb-99f6-4e74-9ade-5b4219d70c12","actor_username":"admin12@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-27 01:12:37.376266+00	
00000000-0000-0000-0000-000000000000	2997ea5a-39e0-484b-9aa6-5449fb5cada6	{"action":"token_refreshed","actor_id":"141b2519-daf3-4bf8-8dac-e97840181403","actor_username":"test_personal@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-27 06:05:05.533923+00	
00000000-0000-0000-0000-000000000000	7f8112dd-e90c-41e4-b5b4-cfa80648255c	{"action":"token_revoked","actor_id":"141b2519-daf3-4bf8-8dac-e97840181403","actor_username":"test_personal@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-27 06:05:05.559476+00	
00000000-0000-0000-0000-000000000000	671cf665-5b4c-4abf-a92b-6cae8c0db03a	{"action":"logout","actor_id":"141b2519-daf3-4bf8-8dac-e97840181403","actor_username":"test_personal@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-27 06:31:59.992453+00	
00000000-0000-0000-0000-000000000000	0f910998-a13b-4561-9c2c-7a7301eb599a	{"action":"login","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-27 06:44:21.798089+00	
00000000-0000-0000-0000-000000000000	491e734a-76b2-476c-ad15-c46970371c09	{"action":"logout","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-27 06:46:44.334671+00	
00000000-0000-0000-0000-000000000000	96e5ba05-8190-48c6-862e-6b07688fcbcf	{"action":"token_refreshed","actor_id":"6461c7bb-99f6-4e74-9ade-5b4219d70c12","actor_username":"admin12@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-27 06:56:46.030491+00	
00000000-0000-0000-0000-000000000000	a0745200-a097-461f-b567-f0aed20d20d4	{"action":"token_revoked","actor_id":"6461c7bb-99f6-4e74-9ade-5b4219d70c12","actor_username":"admin12@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-27 06:56:46.048682+00	
00000000-0000-0000-0000-000000000000	67b2e030-dbb0-4270-b8bb-8e0c7a9a8764	{"action":"login","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-27 07:03:08.473947+00	
00000000-0000-0000-0000-000000000000	c7be8797-7c9b-46ad-ae13-a044a0d89ac6	{"action":"logout","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-27 07:03:24.873401+00	
00000000-0000-0000-0000-000000000000	b343d68d-4c4e-404d-876f-f8e527594954	{"action":"user_signedup","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-11-27 07:04:14.630792+00	
00000000-0000-0000-0000-000000000000	86599bad-384c-4c74-88f8-9cc668a90e26	{"action":"login","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-27 07:04:14.644413+00	
00000000-0000-0000-0000-000000000000	0391a55b-a455-4454-a02b-182954e76c7c	{"action":"login","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-27 07:04:20.450897+00	
00000000-0000-0000-0000-000000000000	e701192f-62fa-4bc6-af0a-118b4cc9118b	{"action":"logout","actor_id":"6461c7bb-99f6-4e74-9ade-5b4219d70c12","actor_username":"admin12@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-27 07:05:46.406209+00	
00000000-0000-0000-0000-000000000000	96f21526-7b42-496b-8f2d-83f8203eb9e6	{"action":"login","actor_id":"6461c7bb-99f6-4e74-9ade-5b4219d70c12","actor_username":"admin12@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-27 07:07:30.189656+00	
00000000-0000-0000-0000-000000000000	ba3eafd6-2119-4477-8b5b-7bd0c394f150	{"action":"logout","actor_id":"6461c7bb-99f6-4e74-9ade-5b4219d70c12","actor_username":"admin12@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-27 07:09:00.922995+00	
00000000-0000-0000-0000-000000000000	0fc5861b-9883-43c3-a108-a8937f55d183	{"action":"login","actor_id":"6461c7bb-99f6-4e74-9ade-5b4219d70c12","actor_username":"admin12@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-27 07:10:56.136341+00	
00000000-0000-0000-0000-000000000000	de11ed40-f2fd-4f46-8bdc-81bc77671540	{"action":"logout","actor_id":"6461c7bb-99f6-4e74-9ade-5b4219d70c12","actor_username":"admin12@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-27 07:11:36.030337+00	
00000000-0000-0000-0000-000000000000	6cec17f1-c4eb-4be3-9d37-56b214041cfb	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-27 14:30:46.749478+00	
00000000-0000-0000-0000-000000000000	29d3cdba-2f37-405a-97c8-17844912b06f	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-27 14:30:46.781225+00	
00000000-0000-0000-0000-000000000000	dd810f66-49d3-43ab-8d0a-5a213d2effdf	{"action":"token_refreshed","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-27 14:42:09.38219+00	
00000000-0000-0000-0000-000000000000	b1961cc4-c7ad-473d-81ec-f760a5e453b8	{"action":"token_revoked","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-27 14:42:09.398364+00	
00000000-0000-0000-0000-000000000000	3f8c901c-495f-4256-891d-2d1a3f4506c1	{"action":"login","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-27 14:48:05.023751+00	
00000000-0000-0000-0000-000000000000	42418800-4667-4fcf-945f-ff16aa4ccffe	{"action":"token_refreshed","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-27 15:46:28.478153+00	
00000000-0000-0000-0000-000000000000	bad1c766-40eb-47e0-9d73-c8c5896b2baf	{"action":"token_revoked","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-27 15:46:28.502637+00	
00000000-0000-0000-0000-000000000000	47c5a1f0-b047-43d2-963b-28d95dede28d	{"action":"token_refreshed","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-27 16:14:41.728373+00	
00000000-0000-0000-0000-000000000000	fb0296e5-9a80-4d55-bb10-d80833b3edc8	{"action":"token_revoked","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-27 16:14:41.738532+00	
00000000-0000-0000-0000-000000000000	25e6a9c0-c14c-49af-957f-1d1967446898	{"action":"token_refreshed","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-27 16:14:41.80902+00	
00000000-0000-0000-0000-000000000000	d82a9197-b02c-486f-8894-3eaa028a93f8	{"action":"token_refreshed","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-27 17:15:23.104979+00	
00000000-0000-0000-0000-000000000000	b7648f9d-218d-458d-ba87-4ccfaab6ca4e	{"action":"token_revoked","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-27 17:15:23.12262+00	
00000000-0000-0000-0000-000000000000	e83452e2-df1a-48b1-ad19-488a2b4fd253	{"action":"token_refreshed","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-27 17:15:23.86615+00	
00000000-0000-0000-0000-000000000000	57f03bca-7b7a-4a10-8b6e-03d5a7337241	{"action":"token_refreshed","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-27 17:16:45.586931+00	
00000000-0000-0000-0000-000000000000	8ad4882c-1857-4961-9ab9-a154b6305ede	{"action":"token_revoked","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-27 17:16:45.589088+00	
00000000-0000-0000-0000-000000000000	89edc1ad-b7af-46b6-b566-fe7a10b4495b	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-27 17:30:54.528212+00	
00000000-0000-0000-0000-000000000000	ec7cbf7b-974a-4988-8472-9344cc46285b	{"action":"login","actor_id":"6461c7bb-99f6-4e74-9ade-5b4219d70c12","actor_username":"admin12@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-27 17:31:58.545371+00	
00000000-0000-0000-0000-000000000000	37627ad2-0d58-4e6e-b0c3-e82854f2b05e	{"action":"token_refreshed","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-27 18:26:04.354905+00	
00000000-0000-0000-0000-000000000000	e57eec88-fcaf-4242-80ad-71c82820f9e1	{"action":"token_revoked","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-27 18:26:04.37973+00	
00000000-0000-0000-0000-000000000000	ff604ff9-cf72-493c-a557-6a0525559c36	{"action":"token_refreshed","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-27 18:28:55.942717+00	
00000000-0000-0000-0000-000000000000	5f7fc6df-963a-401a-a5c2-b4fa7bd92d94	{"action":"token_revoked","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-27 18:28:55.944923+00	
00000000-0000-0000-0000-000000000000	ba853037-265d-44f8-8d53-65663d69cb9e	{"action":"logout","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-27 18:29:02.712106+00	
00000000-0000-0000-0000-000000000000	6df46e23-9f3b-47a0-8ade-3fb8fe798b80	{"action":"login","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-27 18:29:54.547841+00	
00000000-0000-0000-0000-000000000000	359397b0-eaae-48da-8301-0f22471d3c0f	{"action":"login","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-27 18:29:54.535776+00	
00000000-0000-0000-0000-000000000000	2ca88f46-dbdd-4e7e-b233-23a5a520a7ad	{"action":"login","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-27 18:29:54.564611+00	
00000000-0000-0000-0000-000000000000	96106ae4-3a4f-4250-9dc5-f88219493770	{"action":"login","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-27 18:29:54.609374+00	
00000000-0000-0000-0000-000000000000	233cd024-76be-46a9-af19-527488f2c17d	{"action":"login","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-27 18:29:54.692321+00	
00000000-0000-0000-0000-000000000000	d2f13a52-5a14-4aa2-9c81-6862b86c2ee1	{"action":"login","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-27 18:50:22.525999+00	
00000000-0000-0000-0000-000000000000	00e55a82-833f-44df-ba5f-009043bcd2a1	{"action":"token_refreshed","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-27 19:40:52.911059+00	
00000000-0000-0000-0000-000000000000	15ba05eb-3b45-4277-9d47-330c5172af81	{"action":"token_revoked","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-27 19:40:52.924229+00	
00000000-0000-0000-0000-000000000000	3aadedae-3697-467a-8ffc-7812887fc52d	{"action":"token_refreshed","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-27 20:02:58.205631+00	
00000000-0000-0000-0000-000000000000	b0a08a25-775e-48cb-8a14-9483810aa21d	{"action":"token_revoked","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-27 20:02:58.230437+00	
00000000-0000-0000-0000-000000000000	2c86c99a-259e-4ab6-8687-f182035d7c60	{"action":"logout","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-27 20:04:25.066666+00	
00000000-0000-0000-0000-000000000000	4af7b912-87d1-4cf1-b97d-b1e86b9848d0	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"danilo@dental.company","user_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","user_phone":""}}	2025-11-27 20:29:55.575028+00	
00000000-0000-0000-0000-000000000000	aeda63be-5466-4b4e-9907-de6307b89928	{"action":"user_recovery_requested","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"user"}	2025-11-27 20:29:55.745455+00	
00000000-0000-0000-0000-000000000000	d28bc5bd-daf5-4cd2-a14e-ca9dd59c1b4e	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"danilo@dental.company","user_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","user_phone":""}}	2025-11-27 20:29:58.510463+00	
00000000-0000-0000-0000-000000000000	65ac11d9-1c8d-43fc-b9b5-df7de57106ce	{"action":"login","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-27 20:36:37.803185+00	
00000000-0000-0000-0000-000000000000	b1eef7be-5fd6-423f-bfe8-5ac2223e4878	{"action":"login","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-27 20:40:22.672097+00	
00000000-0000-0000-0000-000000000000	189e7f84-02bf-4080-b11f-181b0beb9a0d	{"action":"logout","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-27 20:46:40.948262+00	
00000000-0000-0000-0000-000000000000	8220b85c-2065-4faf-89b1-6b40b2634ae8	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"rdmoronm@unjbg.edu.pe","user_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","user_phone":""}}	2025-11-27 20:47:05.556261+00	
00000000-0000-0000-0000-000000000000	d99b3c08-83a8-47a5-a15c-63777979633d	{"action":"user_recovery_requested","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"rdmoronm@unjbg.edu.pe","actor_via_sso":false,"log_type":"user"}	2025-11-27 20:47:05.713285+00	
00000000-0000-0000-0000-000000000000	40759b13-aebf-41da-9c8a-c96eb1aca050	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"danilo@dental.company","user_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","user_phone":""}}	2025-11-27 20:47:07.908368+00	
00000000-0000-0000-0000-000000000000	3db26a0f-8241-4908-90ca-f8319cc927e8	{"action":"login","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-27 20:47:23.599145+00	
00000000-0000-0000-0000-000000000000	e5a81ea3-be2a-4cd1-8414-f7c3c5474f11	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-27 20:50:19.324186+00	
00000000-0000-0000-0000-000000000000	6d27a622-e9ea-4afd-8d78-ff428f762eb1	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-27 20:50:19.326653+00	
00000000-0000-0000-0000-000000000000	fc46e072-b24d-4c3d-9d22-93c30864935d	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"rdmoronm@unjbg.edu.pe","user_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","user_phone":""}}	2025-11-27 20:51:19.718227+00	
00000000-0000-0000-0000-000000000000	30adcc63-0e3d-4c75-87f6-8dd607c8db26	{"action":"user_recovery_requested","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"rdmoronm@unjbg.edu.pe","actor_via_sso":false,"log_type":"user"}	2025-11-27 20:51:19.892809+00	
00000000-0000-0000-0000-000000000000	74e0247e-10f8-43b3-aa07-69e31a71cdb5	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"danilo@dental.company","user_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","user_phone":""}}	2025-11-27 20:51:22.227685+00	
00000000-0000-0000-0000-000000000000	4fad95bc-56a0-419b-b42e-e6e983dc9d45	{"action":"login","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-27 20:51:38.749838+00	
00000000-0000-0000-0000-000000000000	bf82cdd8-85fb-46e8-91d1-9f743a674185	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"rdmoronm@unjbg.edu.pe","user_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","user_phone":""}}	2025-11-27 20:55:38.917491+00	
00000000-0000-0000-0000-000000000000	34231e87-9bf5-48c5-bea6-14bb1532d366	{"action":"user_recovery_requested","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"rdmoronm@unjbg.edu.pe","actor_via_sso":false,"log_type":"user"}	2025-11-27 20:55:39.10129+00	
00000000-0000-0000-0000-000000000000	a01254fe-24e2-421a-bfb6-8fa5402e0608	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"danilo@dental.company","user_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","user_phone":""}}	2025-11-27 20:55:41.093185+00	
00000000-0000-0000-0000-000000000000	8daf4387-8c82-4d18-af83-e297706a8ee1	{"action":"login","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-27 20:56:00.102931+00	
00000000-0000-0000-0000-000000000000	486f5d8c-4900-46aa-a8e7-b33be0b8e708	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"rdmoronm@unjbg.edu.pe","user_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","user_phone":""}}	2025-11-27 20:58:04.409117+00	
00000000-0000-0000-0000-000000000000	5f8677c4-5e58-47bf-8c1e-c3867e15dcb6	{"action":"user_recovery_requested","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"rdmoronm@unjbg.edu.pe","actor_via_sso":false,"log_type":"user"}	2025-11-27 20:58:04.58042+00	
00000000-0000-0000-0000-000000000000	cb67cd0a-eb8f-406d-826c-f2048e258f3e	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"danilo@dental.company","user_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","user_phone":""}}	2025-11-27 20:58:06.770695+00	
00000000-0000-0000-0000-000000000000	e914ad1f-d938-4cb8-9968-7d1f87b38be6	{"action":"login","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-27 20:58:23.270161+00	
00000000-0000-0000-0000-000000000000	3f1e80d0-5332-435c-9127-bde0a5eb3010	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"rdmoronm@unjbg.edu.pe","user_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","user_phone":""}}	2025-11-27 21:03:16.016518+00	
00000000-0000-0000-0000-000000000000	14710058-192f-4c34-9a57-78cb7165ad92	{"action":"user_recovery_requested","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"rdmoronm@unjbg.edu.pe","actor_via_sso":false,"log_type":"user"}	2025-11-27 21:03:16.18776+00	
00000000-0000-0000-0000-000000000000	f358d836-28eb-47f1-98a9-aa00ca1dbfe0	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"danilo@dental.company","user_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","user_phone":""}}	2025-11-27 21:03:18.196603+00	
00000000-0000-0000-0000-000000000000	3fc4f173-cae8-48c7-8da9-a816d3ed65a6	{"action":"login","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-27 21:03:38.767249+00	
00000000-0000-0000-0000-000000000000	c6cfd82e-32d8-4262-b237-9918830f3e0b	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"rdmoronm@unjbg.edu.pe","user_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","user_phone":""}}	2025-11-27 21:09:56.771882+00	
00000000-0000-0000-0000-000000000000	e7fd85ca-6f60-436e-9cb9-bb7c8f344521	{"action":"user_recovery_requested","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"rdmoronm@unjbg.edu.pe","actor_via_sso":false,"log_type":"user"}	2025-11-27 21:09:57.195164+00	
00000000-0000-0000-0000-000000000000	ab7f2d3d-1551-4307-9b7b-9b28b4364f9a	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"danilo@dental.company","user_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","user_phone":""}}	2025-11-27 21:09:59.370355+00	
00000000-0000-0000-0000-000000000000	966d8fcf-98d6-4a98-9acd-60258a2f877c	{"action":"login","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-27 21:10:20.170408+00	
00000000-0000-0000-0000-000000000000	16626377-1245-4aea-8501-358944d455c0	{"action":"user_updated_password","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"user"}	2025-11-27 21:10:38.191265+00	
00000000-0000-0000-0000-000000000000	ac00ed57-883f-4eb9-ab35-b056426d1cc5	{"action":"user_modified","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"user"}	2025-11-27 21:10:38.192811+00	
00000000-0000-0000-0000-000000000000	df548a27-19c6-45ef-9eeb-bf2cbe27ab2a	{"action":"login","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-27 21:12:48.150211+00	
00000000-0000-0000-0000-000000000000	97464d0d-6eb0-4a57-bf57-fc038df244a4	{"action":"user_updated_password","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"user"}	2025-11-27 21:12:48.711041+00	
00000000-0000-0000-0000-000000000000	0abc456c-7479-4b8e-84cb-ec8055cbc493	{"action":"user_modified","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"user"}	2025-11-27 21:12:48.717502+00	
00000000-0000-0000-0000-000000000000	dea62b07-19aa-4682-8ba1-51c4a648b1d8	{"action":"token_refreshed","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-27 22:12:05.434878+00	
00000000-0000-0000-0000-000000000000	1c7f2a0b-afee-4b2a-b03a-3c30154bcea6	{"action":"token_revoked","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-27 22:12:05.459998+00	
00000000-0000-0000-0000-000000000000	c5dac2c9-1750-496e-bc6e-d8a552ff279b	{"action":"token_refreshed","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-27 23:25:34.871684+00	
00000000-0000-0000-0000-000000000000	d7cddf70-94f3-414b-8582-a81877ce19e4	{"action":"token_revoked","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-27 23:25:34.878213+00	
00000000-0000-0000-0000-000000000000	1dc62540-af50-4621-9ab0-2961a2f7a755	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-27 23:43:05.863461+00	
00000000-0000-0000-0000-000000000000	e1c751ae-b1ec-414a-a7fa-d2cd4e99e25e	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-27 23:43:05.889332+00	
00000000-0000-0000-0000-000000000000	5a6fe9f5-a0f8-45b1-8bd2-bf3be830c907	{"action":"token_refreshed","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-28 00:43:55.494228+00	
00000000-0000-0000-0000-000000000000	825c7b49-e678-44e4-8afa-4c816d6ef594	{"action":"token_revoked","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-28 00:43:55.507919+00	
00000000-0000-0000-0000-000000000000	aa65af27-648c-475e-a9d2-ffc7ee321a05	{"action":"token_refreshed","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-28 01:24:55.37514+00	
00000000-0000-0000-0000-000000000000	2b743776-11e1-407b-b62b-b20e9cc235b2	{"action":"token_revoked","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-28 01:24:55.402428+00	
00000000-0000-0000-0000-000000000000	2e2aa2e0-20ba-4a3c-aea3-96126c505fa9	{"action":"logout","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-28 01:27:53.829352+00	
00000000-0000-0000-0000-000000000000	df9ed8a9-b4ba-4af3-9774-3aee45b4ef07	{"action":"token_refreshed","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-28 02:45:10.10408+00	
00000000-0000-0000-0000-000000000000	88911cbe-24c3-4e92-8cc2-060f1070ecf8	{"action":"token_revoked","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-28 02:45:10.132848+00	
00000000-0000-0000-0000-000000000000	ab13125c-15d7-4540-9134-23c5e3549d8f	{"action":"token_refreshed","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-28 03:53:47.851473+00	
00000000-0000-0000-0000-000000000000	386dc15c-3eb5-4eb8-8858-887631953e85	{"action":"token_refreshed","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-28 05:16:56.356636+00	
00000000-0000-0000-0000-000000000000	49677658-cae9-484b-9844-5d32d7dc818f	{"action":"token_revoked","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-28 05:16:56.377536+00	
00000000-0000-0000-0000-000000000000	10da6689-7c04-4c70-8ae5-80d77162f1bc	{"action":"token_refreshed","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-28 05:24:13.692331+00	
00000000-0000-0000-0000-000000000000	b4801747-1320-41d0-9f15-bacfbae30062	{"action":"token_refreshed","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-28 05:24:15.931869+00	
00000000-0000-0000-0000-000000000000	17b13c5c-3699-4b87-bad3-d5fe8bce67bc	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-28 11:17:47.126021+00	
00000000-0000-0000-0000-000000000000	2e8071da-090a-46ba-8364-379dee2e76b0	{"action":"logout","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-28 12:12:25.126649+00	
00000000-0000-0000-0000-000000000000	807f4d28-4ab5-44dc-aa38-6798958616fc	{"action":"login","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-28 14:03:48.126119+00	
00000000-0000-0000-0000-000000000000	32df827e-b9f8-41ea-86ab-0df7e9e14b99	{"action":"logout","actor_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","actor_username":"admin1@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-28 14:20:40.815967+00	
00000000-0000-0000-0000-000000000000	3eb0c93a-6b07-4f3b-a48d-12d2694d088f	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-28 14:27:52.348079+00	
00000000-0000-0000-0000-000000000000	d4933ca0-2b75-4b2d-a2a3-d6d1436a041d	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-28 14:27:52.353632+00	
00000000-0000-0000-0000-000000000000	182e06f9-2eb4-49c0-90e8-fb7376ad6cd0	{"action":"token_refreshed","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-28 15:06:28.15061+00	
00000000-0000-0000-0000-000000000000	7766a5e6-41a1-4c10-9250-74cb06c6eb37	{"action":"token_revoked","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-28 15:06:28.166612+00	
00000000-0000-0000-0000-000000000000	7734b08d-9650-4e5a-acce-23971fe27bb1	{"action":"token_refreshed","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-28 17:23:05.378469+00	
00000000-0000-0000-0000-000000000000	7560f7a4-1c02-4005-9083-b3c3225ff26a	{"action":"token_revoked","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-28 17:23:05.405105+00	
00000000-0000-0000-0000-000000000000	24b9d4ed-7ac3-4e69-b679-7e65a663be3d	{"action":"token_refreshed","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-28 17:23:45.58477+00	
00000000-0000-0000-0000-000000000000	64d17792-df08-4adb-a244-81f08c02dd0a	{"action":"token_refreshed","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-28 19:42:23.360495+00	
00000000-0000-0000-0000-000000000000	d0e5096e-13dc-4823-a8b7-517d4c5e9b91	{"action":"token_revoked","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-28 19:42:23.381171+00	
00000000-0000-0000-0000-000000000000	b3aab5a7-121c-481a-ab6c-9192bf22232b	{"action":"token_refreshed","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-28 19:42:48.517934+00	
00000000-0000-0000-0000-000000000000	53669771-deb6-414b-ab99-b3ac4bdaf0a6	{"action":"token_refreshed","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-28 20:46:08.766259+00	
00000000-0000-0000-0000-000000000000	fc548cae-3394-4210-81e2-472c59eacf86	{"action":"token_revoked","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-28 20:46:08.779442+00	
00000000-0000-0000-0000-000000000000	3de5ba5b-65c6-403e-9c64-6d3b1d55e158	{"action":"token_refreshed","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-28 20:53:34.598468+00	
00000000-0000-0000-0000-000000000000	32435655-c8d3-449f-8b8d-b658d91a4003	{"action":"token_refreshed","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-28 20:53:35.322867+00	
00000000-0000-0000-0000-000000000000	f869b93e-7727-4ff2-932b-3340b4c678af	{"action":"login","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-28 21:01:10.917175+00	
00000000-0000-0000-0000-000000000000	ba982082-1848-4882-91e9-41fc1354c569	{"action":"token_refreshed","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-28 21:53:35.738784+00	
00000000-0000-0000-0000-000000000000	c501449f-8fc2-4596-99c2-330161e7ae22	{"action":"token_revoked","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-28 21:53:35.7653+00	
00000000-0000-0000-0000-000000000000	c789fbb3-09c8-456b-ad8e-5f1acf187ecd	{"action":"token_refreshed","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-28 22:03:05.376731+00	
00000000-0000-0000-0000-000000000000	650526bd-06ea-432e-a414-df123bff0a36	{"action":"token_revoked","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-28 22:03:05.379685+00	
00000000-0000-0000-0000-000000000000	e65744f5-7262-47e1-ae0c-c7d9e3dcda7d	{"action":"logout","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-28 22:30:23.388106+00	
00000000-0000-0000-0000-000000000000	da85ddbb-52d7-4e5a-81e5-589610b25cc2	{"action":"user_signedup","actor_id":"9a794dc9-c93d-42f4-92d9-424ada6ffa9a","actor_username":"dental1@dental.company","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-11-28 22:31:16.237287+00	
00000000-0000-0000-0000-000000000000	db51d80a-9bb6-449e-be16-185dec5a1fe4	{"action":"login","actor_id":"9a794dc9-c93d-42f4-92d9-424ada6ffa9a","actor_username":"dental1@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-28 22:31:16.247188+00	
00000000-0000-0000-0000-000000000000	7992fa40-3eab-484e-926e-a4a67124b84f	{"action":"logout","actor_id":"9a794dc9-c93d-42f4-92d9-424ada6ffa9a","actor_username":"dental1@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-28 22:34:18.770216+00	
00000000-0000-0000-0000-000000000000	54a7945e-57e0-4c56-9d81-2149a2d777f2	{"action":"user_signedup","actor_id":"385e08f4-01d5-43c3-b283-4a9d39f1eedc","actor_username":"admin2025@dental.company","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-11-28 22:34:47.925792+00	
00000000-0000-0000-0000-000000000000	741482be-25b1-495e-b95e-81391d986649	{"action":"login","actor_id":"385e08f4-01d5-43c3-b283-4a9d39f1eedc","actor_username":"admin2025@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-28 22:34:47.939918+00	
00000000-0000-0000-0000-000000000000	f7199627-3637-4214-ae3c-1d43541578d1	{"action":"logout","actor_id":"385e08f4-01d5-43c3-b283-4a9d39f1eedc","actor_username":"admin2025@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-28 22:39:30.235006+00	
00000000-0000-0000-0000-000000000000	abe2ef72-b629-4359-a744-812e2f2e0968	{"action":"user_signedup","actor_id":"9dfb113b-8b3f-4e0a-8b2c-4fd939f16bf5","actor_username":"administrador_cod@dental.company","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-11-28 22:40:09.633202+00	
00000000-0000-0000-0000-000000000000	3176372a-20f5-4de5-b83b-4d417dcf7e0f	{"action":"login","actor_id":"9dfb113b-8b3f-4e0a-8b2c-4fd939f16bf5","actor_username":"administrador_cod@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-28 22:40:09.638234+00	
00000000-0000-0000-0000-000000000000	069a5f88-f345-45e1-b083-8d781697fbf5	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"odontologo4@hotmail.com","user_id":"cddeb628-0403-4946-9a2e-c786fc5482fe","user_phone":""}}	2025-11-28 22:53:44.560904+00	
00000000-0000-0000-0000-000000000000	ea8def28-bf39-47f7-8aea-d1b3bf09378c	{"action":"logout","actor_id":"7fd13530-51f9-406e-b127-8377e2832830","actor_username":"pruebaadmin@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-30 01:27:17.206785+00	
00000000-0000-0000-0000-000000000000	8c7c57e5-8745-4f08-8991-b37ec2d12da5	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"danilomm.g73@gmail.com","user_id":"7fd13530-51f9-406e-b127-8377e2832830","user_phone":""}}	2025-11-30 01:28:14.939896+00	
00000000-0000-0000-0000-000000000000	df363f5a-ee8c-42f9-94dc-dc24bdc918fd	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"admin12@dental.company","user_id":"6461c7bb-99f6-4e74-9ade-5b4219d70c12","user_phone":""}}	2025-11-28 22:56:41.964419+00	
00000000-0000-0000-0000-000000000000	595b0726-4590-4367-b76d-53c0d7daa38a	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"admin1@dental.company","user_id":"1adcab2f-7ad4-43f6-9f2a-0e5b86b7653f","user_phone":""}}	2025-11-28 22:56:48.63908+00	
00000000-0000-0000-0000-000000000000	9d43a4ba-2cce-4e6f-8193-c0981bdaaa72	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"odontologo2@dental.company","user_id":"fc3f9937-ee2b-4cc6-b683-9da07919edc4","user_phone":""}}	2025-11-28 22:58:39.503967+00	
00000000-0000-0000-0000-000000000000	60a80b7a-5e13-4148-a996-ae3b7507846c	{"action":"token_refreshed","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-28 23:02:32.847768+00	
00000000-0000-0000-0000-000000000000	1b3f3a47-d825-429f-9f7b-dca1b13f6208	{"action":"token_revoked","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-28 23:02:32.849386+00	
00000000-0000-0000-0000-000000000000	24478f62-0202-46c2-aaf7-718fee32e60f	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-28 23:05:13.922739+00	
00000000-0000-0000-0000-000000000000	dcab72a9-517c-4097-8d1a-d3f2c6d118ab	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-28 23:05:13.92796+00	
00000000-0000-0000-0000-000000000000	a288146d-d164-45a1-bca9-9b5a21e68f45	{"action":"user_signedup","actor_id":"a228553a-4d6b-4efd-96ec-2f641f19d05a","actor_username":"alexis@dental.company","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-11-28 23:09:59.830251+00	
00000000-0000-0000-0000-000000000000	54154f3d-527a-46f6-8376-6d1ceb2db825	{"action":"login","actor_id":"a228553a-4d6b-4efd-96ec-2f641f19d05a","actor_username":"alexis@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-28 23:09:59.839694+00	
00000000-0000-0000-0000-000000000000	2136326d-f143-4bf2-81ee-b801db904eb8	{"action":"login","actor_id":"a228553a-4d6b-4efd-96ec-2f641f19d05a","actor_username":"alexis@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-28 23:10:07.302174+00	
00000000-0000-0000-0000-000000000000	8cf11877-dd7d-45fd-a9fa-11d60eda39da	{"action":"logout","actor_id":"a228553a-4d6b-4efd-96ec-2f641f19d05a","actor_username":"alexis@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-28 23:10:56.905599+00	
00000000-0000-0000-0000-000000000000	55e4a33f-1633-4dbd-baf2-9eeb716c8893	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"adcoaquiraq@unjbg.edu.pe","user_id":"a228553a-4d6b-4efd-96ec-2f641f19d05a","user_phone":""}}	2025-11-28 23:11:19.498586+00	
00000000-0000-0000-0000-000000000000	c5328d4b-f513-4220-8c06-ddd3d1dc0995	{"action":"user_recovery_requested","actor_id":"a228553a-4d6b-4efd-96ec-2f641f19d05a","actor_username":"adcoaquiraq@unjbg.edu.pe","actor_via_sso":false,"log_type":"user"}	2025-11-28 23:11:19.711248+00	
00000000-0000-0000-0000-000000000000	cd87c3cb-f8ec-462f-8add-07d97c0a88c7	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"alexis@dental.company","user_id":"a228553a-4d6b-4efd-96ec-2f641f19d05a","user_phone":""}}	2025-11-28 23:11:22.259153+00	
00000000-0000-0000-0000-000000000000	36e170f3-2796-4142-85ee-90b687990ffc	{"action":"login","actor_id":"a228553a-4d6b-4efd-96ec-2f641f19d05a","actor_username":"alexis@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-28 23:11:47.939939+00	
00000000-0000-0000-0000-000000000000	a5fe7925-29bb-45a8-ab0f-991593fed98d	{"action":"login","actor_id":"a228553a-4d6b-4efd-96ec-2f641f19d05a","actor_username":"alexis@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-28 23:11:49.395754+00	
00000000-0000-0000-0000-000000000000	2320d385-fbee-46fb-8ac5-26db16eb23a4	{"action":"logout","actor_id":"a228553a-4d6b-4efd-96ec-2f641f19d05a","actor_username":"alexis@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-28 23:12:07.274324+00	
00000000-0000-0000-0000-000000000000	e80a852a-c0d3-4a07-a537-6c2ea7355f58	{"action":"login","actor_id":"a228553a-4d6b-4efd-96ec-2f641f19d05a","actor_username":"alexis@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-28 23:12:16.921226+00	
00000000-0000-0000-0000-000000000000	77357493-6b1a-4d7f-83e4-5d273190bbdd	{"action":"login","actor_id":"a228553a-4d6b-4efd-96ec-2f641f19d05a","actor_username":"alexis@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-28 23:12:17.457616+00	
00000000-0000-0000-0000-000000000000	eb69c457-5312-442b-a8cc-5ee4522fae5e	{"action":"logout","actor_id":"a228553a-4d6b-4efd-96ec-2f641f19d05a","actor_username":"alexis@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-28 23:15:18.344115+00	
00000000-0000-0000-0000-000000000000	f39df2ca-dc84-41d6-8c9e-405fb5737b9a	{"action":"token_refreshed","actor_id":"9dfb113b-8b3f-4e0a-8b2c-4fd939f16bf5","actor_username":"administrador_cod@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-28 23:38:45.752645+00	
00000000-0000-0000-0000-000000000000	3f45e26d-0b9f-492e-8d48-46ba5073f078	{"action":"token_revoked","actor_id":"9dfb113b-8b3f-4e0a-8b2c-4fd939f16bf5","actor_username":"administrador_cod@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-28 23:38:45.775967+00	
00000000-0000-0000-0000-000000000000	1fc84836-5f39-4972-8567-868423fae550	{"action":"login","actor_id":"a228553a-4d6b-4efd-96ec-2f641f19d05a","actor_username":"alexis@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-29 00:03:35.544743+00	
00000000-0000-0000-0000-000000000000	e8e29ded-0374-40bb-a892-4aa2486b315f	{"action":"token_refreshed","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-29 00:23:42.1455+00	
00000000-0000-0000-0000-000000000000	1047e87c-78d0-475a-8623-40a6df616444	{"action":"token_revoked","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-29 00:23:42.163474+00	
00000000-0000-0000-0000-000000000000	02763a6f-59fd-445c-8b2f-226ead430b93	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-29 00:29:31.519047+00	
00000000-0000-0000-0000-000000000000	cfac26af-3b40-43e3-9fed-82b53e94210c	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-29 00:29:31.522127+00	
00000000-0000-0000-0000-000000000000	c95461d8-d9b0-4019-b180-ddd4740ac90c	{"action":"user_signedup","actor_id":"63ca9eda-62b0-4772-b849-a0667b99d20f","actor_username":"jhon@dental.company","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-11-29 00:33:51.178146+00	
00000000-0000-0000-0000-000000000000	97333d63-bcc9-4a38-b077-dc19b725301d	{"action":"login","actor_id":"63ca9eda-62b0-4772-b849-a0667b99d20f","actor_username":"jhon@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-29 00:33:51.200377+00	
00000000-0000-0000-0000-000000000000	6c35be1f-62b4-46e5-a8e0-f45fca818495	{"action":"login","actor_id":"63ca9eda-62b0-4772-b849-a0667b99d20f","actor_username":"jhon@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-29 00:34:05.203255+00	
00000000-0000-0000-0000-000000000000	19f96505-d731-4805-9bbc-01d36b7ae8d3	{"action":"token_refreshed","actor_id":"9dfb113b-8b3f-4e0a-8b2c-4fd939f16bf5","actor_username":"administrador_cod@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-29 01:10:29.078642+00	
00000000-0000-0000-0000-000000000000	fbc6d563-18d5-40b4-8f30-1ada8bf1c954	{"action":"token_revoked","actor_id":"9dfb113b-8b3f-4e0a-8b2c-4fd939f16bf5","actor_username":"administrador_cod@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-29 01:10:29.097722+00	
00000000-0000-0000-0000-000000000000	46dc8847-26f6-42ed-ab23-c25d1538dec4	{"action":"token_refreshed","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-29 01:28:59.66473+00	
00000000-0000-0000-0000-000000000000	343566ee-3c0e-4732-b7ff-61342b8cf7b9	{"action":"token_revoked","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-29 01:28:59.684662+00	
00000000-0000-0000-0000-000000000000	ec5025ab-1baa-4abb-ae59-1035ad3d1731	{"action":"token_refreshed","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-29 01:29:00.181187+00	
00000000-0000-0000-0000-000000000000	988cda50-57c0-4148-b2ce-e3ef255a837d	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-29 01:30:16.795295+00	
00000000-0000-0000-0000-000000000000	53dfbe8a-aef1-4b91-a66c-330ded6bc409	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-29 01:30:16.80605+00	
00000000-0000-0000-0000-000000000000	d8346fe5-e386-4021-9b9a-a557ff43cd34	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-29 16:17:27.460219+00	
00000000-0000-0000-0000-000000000000	104e15e1-c593-4ead-9197-18f698e79b3a	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-29 16:17:27.488435+00	
00000000-0000-0000-0000-000000000000	bcf1aef4-f4dc-4bda-9f95-7f545b390e32	{"action":"token_refreshed","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-29 18:25:08.990896+00	
00000000-0000-0000-0000-000000000000	86f9ebf6-0b5d-4442-a189-d98fd182dfd3	{"action":"token_revoked","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-29 18:25:09.014963+00	
00000000-0000-0000-0000-000000000000	b18dce96-c7e2-4705-8a02-275019c1d4c1	{"action":"token_refreshed","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-29 18:25:09.510423+00	
00000000-0000-0000-0000-000000000000	f68be362-8270-4a42-af38-49df799c7f21	{"action":"token_refreshed","actor_id":"9dfb113b-8b3f-4e0a-8b2c-4fd939f16bf5","actor_username":"administrador_cod@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-29 18:25:36.529245+00	
00000000-0000-0000-0000-000000000000	1160f4f5-04c0-4407-a49c-dafb93726d2e	{"action":"token_revoked","actor_id":"9dfb113b-8b3f-4e0a-8b2c-4fd939f16bf5","actor_username":"administrador_cod@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-29 18:25:36.531154+00	
00000000-0000-0000-0000-000000000000	df00bc98-0801-4f9b-ad43-5ef2a58071a0	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-29 21:06:34.282675+00	
00000000-0000-0000-0000-000000000000	9d2e3c81-8ab7-4b1e-96c6-af39d46a2f69	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-29 22:05:09.119077+00	
00000000-0000-0000-0000-000000000000	8b1316f0-bcff-4138-9eee-81362f3e3e67	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-29 22:05:09.145141+00	
00000000-0000-0000-0000-000000000000	19df9b02-feb2-4454-b7a7-93ed2c8dd827	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-29 23:03:19.658782+00	
00000000-0000-0000-0000-000000000000	c19cba2a-bf0a-418d-9bbc-f37d77546a8e	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-29 23:03:19.674392+00	
00000000-0000-0000-0000-000000000000	c01db11c-7122-4d16-a2ea-07d62a0e9e74	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-29 23:21:47.145765+00	
00000000-0000-0000-0000-000000000000	47e10141-244e-4542-8750-5493170f6655	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-29 23:21:47.16394+00	
00000000-0000-0000-0000-000000000000	b60cca2c-bf46-4bde-8599-1ce08e132660	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-29 23:21:47.931771+00	
00000000-0000-0000-0000-000000000000	5f203cbc-d82a-4236-bdcd-cfd6cd8ff2a4	{"action":"token_refreshed","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-29 23:42:31.977455+00	
00000000-0000-0000-0000-000000000000	892871cb-deea-4538-917f-2c229507c3aa	{"action":"token_revoked","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-29 23:42:31.998955+00	
00000000-0000-0000-0000-000000000000	d2813a32-6d61-44a8-abf0-dbc73d6c14a8	{"action":"token_refreshed","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-29 23:42:33.439204+00	
00000000-0000-0000-0000-000000000000	9ed6b123-ec2e-479b-b9bb-af7a0ad049a7	{"action":"token_refreshed","actor_id":"9dfb113b-8b3f-4e0a-8b2c-4fd939f16bf5","actor_username":"administrador_cod@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-29 23:57:59.590528+00	
00000000-0000-0000-0000-000000000000	27ec1e97-3098-4ff1-9f7a-7b5179fb0af0	{"action":"token_revoked","actor_id":"9dfb113b-8b3f-4e0a-8b2c-4fd939f16bf5","actor_username":"administrador_cod@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-29 23:57:59.602338+00	
00000000-0000-0000-0000-000000000000	8141f8b8-b222-41a2-99dd-d7c8c14fb8fb	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 00:02:04.631692+00	
00000000-0000-0000-0000-000000000000	b3e98425-de56-4e8d-86a0-6a39639ed07f	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 00:02:04.653034+00	
00000000-0000-0000-0000-000000000000	83542c6e-98f8-4f17-a92f-3b6e1696f778	{"action":"logout","actor_id":"9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128","actor_username":"danilo@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-30 00:19:06.707371+00	
00000000-0000-0000-0000-000000000000	c00df1c2-950e-4143-9105-006804efde4a	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-30 00:20:58.194481+00	
00000000-0000-0000-0000-000000000000	66bce48b-b8a1-40f9-9d08-7c101603fad1	{"action":"user_signedup","actor_id":"7fd13530-51f9-406e-b127-8377e2832830","actor_username":"pruebaadmin@dental.company","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-11-30 00:22:49.074268+00	
00000000-0000-0000-0000-000000000000	b8d654f9-73d1-4224-ba92-3607021fea5c	{"action":"login","actor_id":"7fd13530-51f9-406e-b127-8377e2832830","actor_username":"pruebaadmin@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-30 00:22:49.098458+00	
00000000-0000-0000-0000-000000000000	a023dc57-9601-4be9-a058-1f6cd9f884dc	{"action":"login","actor_id":"7fd13530-51f9-406e-b127-8377e2832830","actor_username":"pruebaadmin@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-30 00:23:02.48362+00	
00000000-0000-0000-0000-000000000000	672bd3b2-9d98-4e0b-aa9d-747d3a074883	{"action":"token_refreshed","actor_id":"a228553a-4d6b-4efd-96ec-2f641f19d05a","actor_username":"alexis@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 00:23:39.759043+00	
00000000-0000-0000-0000-000000000000	811a378c-9031-4f26-958f-9129ac58e78a	{"action":"token_revoked","actor_id":"a228553a-4d6b-4efd-96ec-2f641f19d05a","actor_username":"alexis@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 00:23:39.762032+00	
00000000-0000-0000-0000-000000000000	69614b05-d542-4817-a2c0-a0b99447ddf7	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"administrador_cod@dental.company","user_id":"9dfb113b-8b3f-4e0a-8b2c-4fd939f16bf5","user_phone":""}}	2025-11-30 00:56:18.337008+00	
00000000-0000-0000-0000-000000000000	f10c0ea1-9097-4303-be83-947052c38cf2	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 01:05:36.536247+00	
00000000-0000-0000-0000-000000000000	6c049447-2a3a-4112-9dcb-f8a9f53bdc90	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 01:05:36.558312+00	
00000000-0000-0000-0000-000000000000	4ec9c79d-0abf-41c4-b291-4b2e004574f7	{"action":"logout","actor_id":"7fd13530-51f9-406e-b127-8377e2832830","actor_username":"pruebaadmin@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-30 01:16:38.314599+00	
00000000-0000-0000-0000-000000000000	c6783f0c-3d9f-409d-af1b-53bddede0eed	{"action":"login","actor_id":"7fd13530-51f9-406e-b127-8377e2832830","actor_username":"pruebaadmin@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-30 01:17:31.970284+00	
00000000-0000-0000-0000-000000000000	94aff4a6-524b-4e99-af1a-c2096c1b0006	{"action":"user_recovery_requested","actor_id":"7fd13530-51f9-406e-b127-8377e2832830","actor_username":"danilomm.g73@gmail.com","actor_via_sso":false,"log_type":"user"}	2025-11-30 01:28:15.147937+00	
00000000-0000-0000-0000-000000000000	88682032-7a26-4a91-a49e-937ac1a80cbc	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"pruebaadmin@dental.company","user_id":"7fd13530-51f9-406e-b127-8377e2832830","user_phone":""}}	2025-11-30 01:28:17.359565+00	
00000000-0000-0000-0000-000000000000	9f17b4d1-12e0-4ebf-8305-a4ed9d68595f	{"action":"login","actor_id":"7fd13530-51f9-406e-b127-8377e2832830","actor_username":"pruebaadmin@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-30 01:29:16.751424+00	
00000000-0000-0000-0000-000000000000	78bacfd6-3fcc-4a83-b15d-e966e5f95e65	{"action":"user_updated_password","actor_id":"7fd13530-51f9-406e-b127-8377e2832830","actor_username":"pruebaadmin@dental.company","actor_via_sso":false,"log_type":"user"}	2025-11-30 01:30:00.775125+00	
00000000-0000-0000-0000-000000000000	adb36978-00e7-4288-a4af-0c7ab97f3ed6	{"action":"user_modified","actor_id":"7fd13530-51f9-406e-b127-8377e2832830","actor_username":"pruebaadmin@dental.company","actor_via_sso":false,"log_type":"user"}	2025-11-30 01:30:00.775784+00	
00000000-0000-0000-0000-000000000000	e0a82ba7-f4f6-4cd4-8fac-3689e0e0dfe5	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 01:41:31.500584+00	
00000000-0000-0000-0000-000000000000	6acb1469-0df8-4876-915b-a27702a26d32	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 01:41:31.51162+00	
00000000-0000-0000-0000-000000000000	d74a3ba9-3a02-4170-ab81-8476840f90b4	{"action":"token_refreshed","actor_id":"7fd13530-51f9-406e-b127-8377e2832830","actor_username":"pruebaadmin@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 03:14:10.257811+00	
00000000-0000-0000-0000-000000000000	b2f61a8b-fc2a-4b20-b204-992e9c0eddc4	{"action":"token_revoked","actor_id":"7fd13530-51f9-406e-b127-8377e2832830","actor_username":"pruebaadmin@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 03:14:10.285116+00	
00000000-0000-0000-0000-000000000000	b5e716ed-eb83-4976-af50-3afce68da8d9	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 06:28:07.803833+00	
00000000-0000-0000-0000-000000000000	7e14c2fa-416a-430e-9e0c-6cdd8eb4c560	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 06:28:07.83067+00	
00000000-0000-0000-0000-000000000000	e3f7b64a-ad23-4b76-bbca-aa32c1081f6a	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 13:12:21.184959+00	
00000000-0000-0000-0000-000000000000	7c0ae060-0b2c-4c6e-83cf-99daf7a22731	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 13:12:21.215548+00	
00000000-0000-0000-0000-000000000000	a0ed2fc6-1c94-48b9-b52e-56e0c3fca859	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 14:31:13.825397+00	
00000000-0000-0000-0000-000000000000	b60f0129-09c5-4067-ac85-c7f12cb770ee	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 14:31:13.837643+00	
00000000-0000-0000-0000-000000000000	2d7a008a-b81d-40d4-b2e3-0ec9f38d2319	{"action":"token_refreshed","actor_id":"7fd13530-51f9-406e-b127-8377e2832830","actor_username":"pruebaadmin@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 14:50:28.461869+00	
00000000-0000-0000-0000-000000000000	22265d67-d255-412a-a460-dff9cfa602fd	{"action":"token_revoked","actor_id":"7fd13530-51f9-406e-b127-8377e2832830","actor_username":"pruebaadmin@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 14:50:28.475749+00	
00000000-0000-0000-0000-000000000000	5ace943e-607f-4e34-99f0-7a136f109541	{"action":"login","actor_id":"385e08f4-01d5-43c3-b283-4a9d39f1eedc","actor_username":"admin2025@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-30 14:52:40.726932+00	
00000000-0000-0000-0000-000000000000	5ac03e3f-16e5-4bb5-bbd2-74c7bad381d6	{"action":"logout","actor_id":"385e08f4-01d5-43c3-b283-4a9d39f1eedc","actor_username":"admin2025@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-30 14:53:25.048534+00	
00000000-0000-0000-0000-000000000000	249f30c4-f7a4-4961-8188-d450c07d3730	{"action":"login","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-30 14:54:03.750731+00	
00000000-0000-0000-0000-000000000000	a094ac60-ca6c-438c-bb23-8b5491151028	{"action":"token_refreshed","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 15:53:40.516361+00	
00000000-0000-0000-0000-000000000000	f2b8f012-b908-4ba3-9768-118439555a38	{"action":"token_revoked","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 15:53:40.54218+00	
00000000-0000-0000-0000-000000000000	397ceeae-d885-42c5-8ff9-2dced1f56b87	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 16:05:08.327211+00	
00000000-0000-0000-0000-000000000000	f35930e0-8939-487b-8d98-24ff4b28c3a3	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 16:05:08.335579+00	
00000000-0000-0000-0000-000000000000	21ab02a5-316e-4546-99e9-7fad5ba671b6	{"action":"token_refreshed","actor_id":"a228553a-4d6b-4efd-96ec-2f641f19d05a","actor_username":"alexis@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 16:38:10.67799+00	
00000000-0000-0000-0000-000000000000	ac246b1d-be40-466a-8b67-52658b238eac	{"action":"token_revoked","actor_id":"a228553a-4d6b-4efd-96ec-2f641f19d05a","actor_username":"alexis@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 16:38:10.695458+00	
00000000-0000-0000-0000-000000000000	c64207ab-7534-4274-9575-1799bdb76083	{"action":"token_refreshed","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 16:52:14.110909+00	
00000000-0000-0000-0000-000000000000	6858f452-00c8-4432-9a40-3fb568943700	{"action":"token_revoked","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 16:52:14.116676+00	
00000000-0000-0000-0000-000000000000	ff4f42c9-6d74-493e-86f1-53e6ef1bb82f	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 17:05:08.891075+00	
00000000-0000-0000-0000-000000000000	a68fd9e7-bb45-44b2-8edf-f2605c1e0f1b	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 17:05:08.910758+00	
00000000-0000-0000-0000-000000000000	4e6a59df-82d6-41b4-9300-587fe66808a2	{"action":"logout","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-30 17:27:07.848172+00	
00000000-0000-0000-0000-000000000000	a99cb028-2ee1-48aa-b94f-3ba93c41409e	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-30 17:28:18.609585+00	
00000000-0000-0000-0000-000000000000	c5e09f9f-b22d-46fd-b092-7f5e3afb1deb	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-30 17:28:34.157525+00	
00000000-0000-0000-0000-000000000000	9d7e5f4d-176d-4f3e-b78f-82168ce38499	{"action":"token_refreshed","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 17:50:52.741046+00	
00000000-0000-0000-0000-000000000000	8ae70b7d-70ae-4828-97dc-34ca4ef428b0	{"action":"token_revoked","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 17:50:52.775084+00	
00000000-0000-0000-0000-000000000000	7d2f5e95-7467-4019-88a1-01d6a9c0b4ea	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 18:54:50.897839+00	
00000000-0000-0000-0000-000000000000	9037c4c6-4864-4862-bd8c-18e876e39dc0	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 18:54:50.927939+00	
00000000-0000-0000-0000-000000000000	378a76d7-398e-4091-a919-15739f922f53	{"action":"token_refreshed","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 19:22:08.706095+00	
00000000-0000-0000-0000-000000000000	3b43348a-c8ba-4326-ac4f-ba324ca14a0b	{"action":"token_revoked","actor_id":"c65d6183-16bf-4a0a-ac33-14b331e59cc3","actor_username":"odontologo3@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 19:22:08.730326+00	
00000000-0000-0000-0000-000000000000	a5ce3548-c947-4839-96c7-9fda4f30d94f	{"action":"token_refreshed","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 19:55:34.91714+00	
00000000-0000-0000-0000-000000000000	a232bbba-db5d-45b7-90a4-7b0dad0cfac6	{"action":"token_revoked","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 19:55:34.935512+00	
00000000-0000-0000-0000-000000000000	ed9fc5fd-69c6-4c2d-8e66-c68dfae13ccd	{"action":"logout","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account"}	2025-11-30 20:16:34.041179+00	
00000000-0000-0000-0000-000000000000	bd5823f9-fe75-44c4-9a04-b5d4fe1e9c94	{"action":"token_refreshed","actor_id":"a228553a-4d6b-4efd-96ec-2f641f19d05a","actor_username":"alexis@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 20:27:56.458086+00	
00000000-0000-0000-0000-000000000000	19c21659-2f75-4a0b-bb68-4de726b7bb22	{"action":"token_revoked","actor_id":"a228553a-4d6b-4efd-96ec-2f641f19d05a","actor_username":"alexis@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 20:27:56.476878+00	
00000000-0000-0000-0000-000000000000	ddf6e628-59f3-4626-b802-600520460665	{"action":"login","actor_id":"f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8","actor_username":"admin0@dental.company","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-11-30 20:38:12.113685+00	
00000000-0000-0000-0000-000000000000	f2183190-e1bc-4cb9-a68a-b469a02b3679	{"action":"token_refreshed","actor_id":"a228553a-4d6b-4efd-96ec-2f641f19d05a","actor_username":"alexis@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 21:26:34.875635+00	
00000000-0000-0000-0000-000000000000	a79dd1e6-ac89-479d-8f65-07cf05ebcd57	{"action":"token_revoked","actor_id":"a228553a-4d6b-4efd-96ec-2f641f19d05a","actor_username":"alexis@dental.company","actor_via_sso":false,"log_type":"token"}	2025-11-30 21:26:34.893197+00	
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at") FROM stdin;
135f8658-1c35-44bc-a647-108f7234ceef	51bb9297-1e61-4ab7-988b-d8f2eef5c015	265e1491-2901-4d5e-80b7-dfcdc2cbe0d1	s256	TSBuu7CU4uXJ4M2tRm2qiTXL1zVQ_OKtGES2GHJEO3o	email			2025-09-08 16:23:33.431771+00	2025-09-08 16:23:33.431771+00	email/signup	\N
6664a621-4e6b-448f-8cf7-acb20e85afc8	fc3f9937-ee2b-4cc6-b683-9da07919edc4	a4bab858-4887-448f-82e4-d53829cfa04b	s256	iRp-BhVQDvHESw8s6lzf4V8hnKC_X409ehfxPkFM9C4	email			2025-09-08 16:26:43.459259+00	2025-09-08 16:26:43.459259+00	email/signup	\N
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") FROM stdin;
31ec8fab-61ed-4394-b3d0-4595526208b7	31ec8fab-61ed-4394-b3d0-4595526208b7	{"sub": "31ec8fab-61ed-4394-b3d0-4595526208b7", "email": "danilo26122003@gmail.com", "email_verified": true, "phone_verified": false}	email	2025-09-07 22:40:10.474244+00	2025-09-07 22:40:10.474306+00	2025-09-07 22:40:10.474306+00	bdf47c25-1359-4682-970d-92faa47724fb
cbe231b9-7260-459b-b71f-5399fe725219	cbe231b9-7260-459b-b71f-5399fe725219	{"sub": "cbe231b9-7260-459b-b71f-5399fe725219", "email": "tapion1123@gmail.com", "email_verified": true, "phone_verified": false}	email	2025-09-08 13:05:16.636055+00	2025-09-08 13:05:16.636105+00	2025-09-08 13:05:16.636105+00	d63e76f8-6ee5-4afe-b248-e5e353ded85f
c65d6183-16bf-4a0a-ac33-14b331e59cc3	c65d6183-16bf-4a0a-ac33-14b331e59cc3	{"sub": "c65d6183-16bf-4a0a-ac33-14b331e59cc3", "email": "odontologo3@dental.company", "email_verified": false, "phone_verified": false}	email	2025-09-08 16:32:56.450111+00	2025-09-08 16:32:56.450161+00	2025-09-08 16:32:56.450161+00	a54b6049-d442-4692-8913-8e36d855ba9e
c955e2b0-07b0-455f-8ae5-acd9919fdde2	c955e2b0-07b0-455f-8ae5-acd9919fdde2	{"sub": "c955e2b0-07b0-455f-8ae5-acd9919fdde2", "email": "odontologo4@dental.company", "email_verified": false, "phone_verified": false}	email	2025-09-08 17:27:56.198477+00	2025-09-08 17:27:56.198524+00	2025-09-08 17:27:56.198524+00	cdce7008-b47b-45da-9dba-bfc2d9d4f4ac
482031d1-1a76-46b2-afa6-2cb569b219c5	482031d1-1a76-46b2-afa6-2cb569b219c5	{"sub": "482031d1-1a76-46b2-afa6-2cb569b219c5", "email": "ulises@dental.company", "email_verified": false, "phone_verified": false}	email	2025-09-08 17:34:30.973721+00	2025-09-08 17:34:30.973768+00	2025-09-08 17:34:30.973768+00	71d88468-8ac9-4542-a128-e11de03af9e4
f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8	f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8	{"sub": "f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8", "email": "admin0@dental.company", "email_verified": false, "phone_verified": false}	email	2025-09-15 16:56:21.10278+00	2025-09-15 16:56:21.102832+00	2025-09-15 16:56:21.102832+00	8aa8412e-8632-45ab-83c5-ef5fd3c108f6
141b2519-daf3-4bf8-8dac-e97840181403	141b2519-daf3-4bf8-8dac-e97840181403	{"sub": "141b2519-daf3-4bf8-8dac-e97840181403", "email": "test_personal@dental.company", "email_verified": false, "phone_verified": false}	email	2025-09-22 16:08:53.361493+00	2025-09-22 16:08:53.361549+00	2025-09-22 16:08:53.361549+00	019f43f4-fce1-4ac0-87a8-1651f4e35b47
6c806f28-8135-4406-8a4e-e7a8c5fdadec	6c806f28-8135-4406-8a4e-e7a8c5fdadec	{"sub": "6c806f28-8135-4406-8a4e-e7a8c5fdadec", "email": "sergioco@dental.company", "email_verified": false, "phone_verified": false}	email	2025-09-29 18:20:31.767226+00	2025-09-29 18:20:31.767278+00	2025-09-29 18:20:31.767278+00	4e57d667-7516-4ce2-83bc-07fabf695491
472e0026-4625-4b47-90f9-5319ffad53bd	472e0026-4625-4b47-90f9-5319ffad53bd	{"sub": "472e0026-4625-4b47-90f9-5319ffad53bd", "email": "admin@dental.company", "email_verified": false, "phone_verified": false}	email	2025-10-12 05:32:25.731959+00	2025-10-12 05:32:25.732024+00	2025-10-12 05:32:25.732024+00	88916d32-c50d-4c8a-97dd-4ece7d9a453b
9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128	9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128	{"sub": "9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128", "email": "danilo@dental.company", "email_verified": false, "phone_verified": false}	email	2025-11-27 07:04:14.626019+00	2025-11-27 07:04:14.626072+00	2025-11-27 07:04:14.626072+00	8e193b65-43bd-4fd2-8645-fdd0f8209fd0
9a794dc9-c93d-42f4-92d9-424ada6ffa9a	9a794dc9-c93d-42f4-92d9-424ada6ffa9a	{"sub": "9a794dc9-c93d-42f4-92d9-424ada6ffa9a", "email": "dental1@dental.company", "email_verified": false, "phone_verified": false}	email	2025-11-28 22:31:16.230232+00	2025-11-28 22:31:16.230295+00	2025-11-28 22:31:16.230295+00	827e1ba3-745d-46e2-bada-254b2177919d
385e08f4-01d5-43c3-b283-4a9d39f1eedc	385e08f4-01d5-43c3-b283-4a9d39f1eedc	{"sub": "385e08f4-01d5-43c3-b283-4a9d39f1eedc", "email": "admin2025@dental.company", "email_verified": false, "phone_verified": false}	email	2025-11-28 22:34:47.915299+00	2025-11-28 22:34:47.915359+00	2025-11-28 22:34:47.915359+00	36192622-a44f-445e-9b8b-09ec39eac4dc
a228553a-4d6b-4efd-96ec-2f641f19d05a	a228553a-4d6b-4efd-96ec-2f641f19d05a	{"sub": "a228553a-4d6b-4efd-96ec-2f641f19d05a", "email": "alexis@dental.company", "email_verified": false, "phone_verified": false}	email	2025-11-28 23:09:59.826522+00	2025-11-28 23:09:59.826584+00	2025-11-28 23:09:59.826584+00	8c06f7ec-5282-412b-94d5-65ec49aa1b40
63ca9eda-62b0-4772-b849-a0667b99d20f	63ca9eda-62b0-4772-b849-a0667b99d20f	{"sub": "63ca9eda-62b0-4772-b849-a0667b99d20f", "email": "jhon@dental.company", "email_verified": false, "phone_verified": false}	email	2025-11-29 00:33:51.166516+00	2025-11-29 00:33:51.167216+00	2025-11-29 00:33:51.167216+00	d4443b03-b72b-4e73-a62c-022fb9c1cd98
7fd13530-51f9-406e-b127-8377e2832830	7fd13530-51f9-406e-b127-8377e2832830	{"sub": "7fd13530-51f9-406e-b127-8377e2832830", "email": "pruebaadmin@dental.company", "email_verified": false, "phone_verified": false}	email	2025-11-30 00:22:49.04857+00	2025-11-30 00:22:49.048631+00	2025-11-30 00:22:49.048631+00	56ac04af-2b17-4a6b-a1e1-28100c9931e5
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."instances" ("id", "uuid", "raw_base_config", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") FROM stdin;
5c68946a-efe7-4ff9-b761-1e914d7d1096	2025-09-08 13:05:51.401174+00	2025-09-08 13:05:51.401174+00	password	cee4ea6b-f057-4772-bf25-1970e18ab6e0
7a9a0695-7428-4e24-a5e9-b9e2406800bb	2025-09-08 13:05:51.429288+00	2025-09-08 13:05:51.429288+00	email/signup	a81dfd41-c388-4602-a237-fdb172c1822e
17dcce75-0dbd-460d-9e02-969475773fdc	2025-09-08 13:48:46.495545+00	2025-09-08 13:48:46.495545+00	password	805277b2-9cc3-4067-8ee3-4cd4b12a0fd2
526a4f48-467e-4c3e-b8f0-af19a554d649	2025-09-08 17:34:30.983894+00	2025-09-08 17:34:30.983894+00	password	d34f4619-3239-44eb-9682-b5139699a143
a1bc7671-a2f0-464f-9ff6-fb6607956560	2025-09-08 17:34:36.486681+00	2025-09-08 17:34:36.486681+00	password	5558cff4-88a6-475a-9ffd-d9bd332cb249
58bbc548-b880-48f6-962a-2e127530fc7a	2025-09-09 21:08:39.067589+00	2025-09-09 21:08:39.067589+00	password	7f540b50-953e-4a36-b650-02c33e0242a1
120240f0-fc3e-4851-9735-04432c509876	2025-11-29 00:03:35.675914+00	2025-11-29 00:03:35.675914+00	password	8a215e22-6d10-42ab-adba-d1c2a2b2ba4f
ccd30f78-8f11-4f53-bd94-38ac8b5726e8	2025-11-29 00:33:51.235424+00	2025-11-29 00:33:51.235424+00	password	70aae048-4066-4eb4-a4d9-70924895cb64
a6c8c41e-0af1-4258-9565-07533d65cb3b	2025-11-29 00:34:05.209335+00	2025-11-29 00:34:05.209335+00	password	2dc13549-a8f5-41d1-aacd-a248c91be840
6700e328-7658-4036-9b88-ecd868a3aade	2025-11-30 01:29:16.774199+00	2025-11-30 01:29:16.774199+00	otp	98a1e4c0-4375-453f-a50e-881aa90c1160
bab6c4c7-5901-4146-9419-8205b520493e	2025-11-30 14:54:03.760233+00	2025-11-30 14:54:03.760233+00	password	a7bf06e5-fb96-468f-8c83-3a6d5046ee35
783c8522-a9ca-4b6d-b4a7-12f5c20b0ddd	2025-11-30 20:38:12.181091+00	2025-11-30 20:38:12.181091+00	password	44198344-b6cb-438c-99ed-45c76e72ce8b
51b72468-505d-4722-acd7-b363cdc3659c	2025-09-29 12:38:11.144832+00	2025-09-29 12:38:11.144832+00	password	5f88f3b7-5090-463f-a2d9-0a93c993f2b5
10d28036-ddeb-42fb-bf47-47f9e50ad88c	2025-09-29 12:38:38.002427+00	2025-09-29 12:38:38.002427+00	password	a04307b4-c007-4ed3-a3f4-1fee7bed98c1
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."mfa_challenges" ("id", "factor_id", "created_at", "verified_at", "ip_address", "otp_code", "web_authn_session_data") FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."mfa_factors" ("id", "user_id", "friendly_name", "factor_type", "status", "created_at", "updated_at", "secret", "phone", "last_challenged_at", "web_authn_credential", "web_authn_aaguid", "last_webauthn_challenge_data") FROM stdin;
\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."oauth_authorizations" ("id", "authorization_id", "client_id", "user_id", "redirect_uri", "scope", "state", "resource", "code_challenge", "code_challenge_method", "response_type", "status", "authorization_code", "created_at", "expires_at", "approved_at", "nonce") FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."oauth_clients" ("id", "client_secret_hash", "registration_type", "redirect_uris", "grant_types", "client_name", "client_uri", "logo_uri", "created_at", "updated_at", "deleted_at", "client_type") FROM stdin;
\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."oauth_consents" ("id", "user_id", "client_id", "scopes", "granted_at", "revoked_at") FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."one_time_tokens" ("id", "user_id", "token_type", "token_hash", "relates_to", "created_at", "updated_at") FROM stdin;
61fd101f-1b24-400c-9561-ec30d9319755	482031d1-1a76-46b2-afa6-2cb569b219c5	recovery_token	b6a22f6850dcf2ff0617a53b3ba10b92fb34402465c5b7ef02458add	ulises@dental.company	2025-09-14 21:33:28.654685	2025-09-14 21:33:28.654685
e586f0ce-fac2-491d-a520-dedd24d9cdff	a228553a-4d6b-4efd-96ec-2f641f19d05a	recovery_token	4752be39114f70370e02ccdc03b0ad6063eec81984dd54c214536a9f	adcoaquiraq@unjbg.edu.pe	2025-11-28 23:11:22.050944	2025-11-28 23:11:22.050944
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") FROM stdin;
00000000-0000-0000-0000-000000000000	3	uzkjn7gy4knr	cbe231b9-7260-459b-b71f-5399fe725219	f	2025-09-08 13:05:51.388512+00	2025-09-08 13:05:51.388512+00	\N	5c68946a-efe7-4ff9-b761-1e914d7d1096
00000000-0000-0000-0000-000000000000	4	4vrvi4rrzhgh	cbe231b9-7260-459b-b71f-5399fe725219	f	2025-09-08 13:05:51.428089+00	2025-09-08 13:05:51.428089+00	\N	7a9a0695-7428-4e24-a5e9-b9e2406800bb
00000000-0000-0000-0000-000000000000	636	pedknh73ozzn	c65d6183-16bf-4a0a-ac33-14b331e59cc3	t	2025-11-30 16:52:14.124106+00	2025-11-30 17:50:52.775859+00	lcueslegy2hp	bab6c4c7-5901-4146-9419-8205b520493e
00000000-0000-0000-0000-000000000000	642	o5ss53zhzuki	c65d6183-16bf-4a0a-ac33-14b331e59cc3	f	2025-11-30 19:22:08.750556+00	2025-11-30 19:22:08.750556+00	4o6t65iarixl	bab6c4c7-5901-4146-9419-8205b520493e
00000000-0000-0000-0000-000000000000	5	nqzvtrunepqp	cbe231b9-7260-459b-b71f-5399fe725219	t	2025-09-08 13:48:46.467026+00	2025-09-08 14:48:07.304335+00	\N	17dcce75-0dbd-460d-9e02-969475773fdc
00000000-0000-0000-0000-000000000000	635	efsiqc5vzlq4	a228553a-4d6b-4efd-96ec-2f641f19d05a	t	2025-11-30 16:38:10.71413+00	2025-11-30 20:27:56.478948+00	pykmgjg7p3gk	120240f0-fc3e-4851-9735-04432c509876
00000000-0000-0000-0000-000000000000	7	7wrnw3ptoywc	cbe231b9-7260-459b-b71f-5399fe725219	t	2025-09-08 14:48:07.305017+00	2025-09-08 15:46:54.661971+00	nqzvtrunepqp	17dcce75-0dbd-460d-9e02-969475773fdc
00000000-0000-0000-0000-000000000000	645	5srmxpc2c67o	f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8	f	2025-11-30 20:38:12.156633+00	2025-11-30 20:38:12.156633+00	\N	783c8522-a9ca-4b6d-b4a7-12f5c20b0ddd
00000000-0000-0000-0000-000000000000	8	25z5i4vh3awm	cbe231b9-7260-459b-b71f-5399fe725219	t	2025-09-08 15:46:54.680925+00	2025-09-08 16:45:15.395838+00	7wrnw3ptoywc	17dcce75-0dbd-460d-9e02-969475773fdc
00000000-0000-0000-0000-000000000000	17	wtxycv4iw4th	482031d1-1a76-46b2-afa6-2cb569b219c5	f	2025-09-08 17:34:30.982776+00	2025-09-08 17:34:30.982776+00	\N	526a4f48-467e-4c3e-b8f0-af19a554d649
00000000-0000-0000-0000-000000000000	18	wpj4sptwvvz3	482031d1-1a76-46b2-afa6-2cb569b219c5	f	2025-09-08 17:34:36.485557+00	2025-09-08 17:34:36.485557+00	\N	a1bc7671-a2f0-464f-9ff6-fb6607956560
00000000-0000-0000-0000-000000000000	11	lk5h4fhwykrf	cbe231b9-7260-459b-b71f-5399fe725219	t	2025-09-08 16:45:15.398793+00	2025-09-08 19:43:05.058163+00	25z5i4vh3awm	17dcce75-0dbd-460d-9e02-969475773fdc
00000000-0000-0000-0000-000000000000	174	u5zrn3t54tba	c955e2b0-07b0-455f-8ae5-acd9919fdde2	f	2025-09-29 12:38:11.139675+00	2025-09-29 12:38:11.139675+00	\N	51b72468-505d-4722-acd7-b363cdc3659c
00000000-0000-0000-0000-000000000000	175	rruximtbtlnp	c955e2b0-07b0-455f-8ae5-acd9919fdde2	t	2025-09-29 12:38:38.001185+00	2025-09-29 13:44:52.980785+00	\N	10d28036-ddeb-42fb-bf47-47f9e50ad88c
00000000-0000-0000-0000-000000000000	177	lhxdsgouqcb6	c955e2b0-07b0-455f-8ae5-acd9919fdde2	t	2025-09-29 14:50:11.114679+00	2025-09-29 15:54:05.78305+00	t2al36pjx6lu	10d28036-ddeb-42fb-bf47-47f9e50ad88c
00000000-0000-0000-0000-000000000000	184	e7rckegdcv23	c955e2b0-07b0-455f-8ae5-acd9919fdde2	f	2025-09-29 17:24:38.848838+00	2025-09-29 17:24:38.848838+00	gky5wyd3xzxb	10d28036-ddeb-42fb-bf47-47f9e50ad88c
00000000-0000-0000-0000-000000000000	632	lfwxoxy4rpfc	c65d6183-16bf-4a0a-ac33-14b331e59cc3	t	2025-11-30 14:54:03.754201+00	2025-11-30 15:53:40.544557+00	\N	bab6c4c7-5901-4146-9419-8205b520493e
00000000-0000-0000-0000-000000000000	41	xvnhbm3nlt2j	cbe231b9-7260-459b-b71f-5399fe725219	t	2025-09-10 14:22:38.057095+00	2025-09-14 23:22:54.952336+00	ntgxcwwj3hlv	58bbc548-b880-48f6-962a-2e127530fc7a
00000000-0000-0000-0000-000000000000	19	534tisvme63s	cbe231b9-7260-459b-b71f-5399fe725219	t	2025-09-08 19:43:05.07506+00	2025-09-09 21:07:43.47795+00	lk5h4fhwykrf	17dcce75-0dbd-460d-9e02-969475773fdc
00000000-0000-0000-0000-000000000000	30	yrkrykglt6zz	cbe231b9-7260-459b-b71f-5399fe725219	f	2025-09-09 21:07:43.49047+00	2025-09-09 21:07:43.49047+00	534tisvme63s	17dcce75-0dbd-460d-9e02-969475773fdc
00000000-0000-0000-0000-000000000000	31	fln3j2jqiceq	cbe231b9-7260-459b-b71f-5399fe725219	t	2025-09-09 21:08:39.066394+00	2025-09-09 22:07:26.240431+00	\N	58bbc548-b880-48f6-962a-2e127530fc7a
00000000-0000-0000-0000-000000000000	85	vuuaomiyzddd	cbe231b9-7260-459b-b71f-5399fe725219	t	2025-09-14 23:22:54.967749+00	2025-09-15 00:27:26.835865+00	xvnhbm3nlt2j	58bbc548-b880-48f6-962a-2e127530fc7a
00000000-0000-0000-0000-000000000000	32	7izopzhp7oqc	cbe231b9-7260-459b-b71f-5399fe725219	t	2025-09-09 22:07:26.257789+00	2025-09-09 23:11:30.339699+00	fln3j2jqiceq	58bbc548-b880-48f6-962a-2e127530fc7a
00000000-0000-0000-0000-000000000000	86	enmgixpblayz	cbe231b9-7260-459b-b71f-5399fe725219	f	2025-09-15 00:27:26.855763+00	2025-09-15 00:27:26.855763+00	vuuaomiyzddd	58bbc548-b880-48f6-962a-2e127530fc7a
00000000-0000-0000-0000-000000000000	33	k2nv22ols4tq	cbe231b9-7260-459b-b71f-5399fe725219	t	2025-09-09 23:11:30.352867+00	2025-09-10 03:31:48.553663+00	7izopzhp7oqc	58bbc548-b880-48f6-962a-2e127530fc7a
00000000-0000-0000-0000-000000000000	37	vo42ii5e66t3	cbe231b9-7260-459b-b71f-5399fe725219	t	2025-09-10 03:31:48.561503+00	2025-09-10 12:37:30.461693+00	k2nv22ols4tq	58bbc548-b880-48f6-962a-2e127530fc7a
00000000-0000-0000-0000-000000000000	38	ntgxcwwj3hlv	cbe231b9-7260-459b-b71f-5399fe725219	t	2025-09-10 12:37:30.486459+00	2025-09-10 14:22:38.049003+00	vo42ii5e66t3	58bbc548-b880-48f6-962a-2e127530fc7a
00000000-0000-0000-0000-000000000000	633	lcueslegy2hp	c65d6183-16bf-4a0a-ac33-14b331e59cc3	t	2025-11-30 15:53:40.567881+00	2025-11-30 16:52:14.118111+00	lfwxoxy4rpfc	bab6c4c7-5901-4146-9419-8205b520493e
00000000-0000-0000-0000-000000000000	603	r6wmhqns34lc	63ca9eda-62b0-4772-b849-a0667b99d20f	f	2025-11-29 00:33:51.227336+00	2025-11-29 00:33:51.227336+00	\N	ccd30f78-8f11-4f53-bd94-38ac8b5726e8
00000000-0000-0000-0000-000000000000	604	pk7hgogkzx4a	63ca9eda-62b0-4772-b849-a0667b99d20f	f	2025-11-29 00:34:05.207939+00	2025-11-29 00:34:05.207939+00	\N	a6c8c41e-0af1-4258-9565-07533d65cb3b
00000000-0000-0000-0000-000000000000	640	4o6t65iarixl	c65d6183-16bf-4a0a-ac33-14b331e59cc3	t	2025-11-30 17:50:52.802147+00	2025-11-30 19:22:08.731148+00	pedknh73ozzn	bab6c4c7-5901-4146-9419-8205b520493e
00000000-0000-0000-0000-000000000000	646	sydhtgjtqm6c	a228553a-4d6b-4efd-96ec-2f641f19d05a	f	2025-11-30 21:26:34.917244+00	2025-11-30 21:26:34.917244+00	ickl3h35dn27	120240f0-fc3e-4851-9735-04432c509876
00000000-0000-0000-0000-000000000000	176	t2al36pjx6lu	c955e2b0-07b0-455f-8ae5-acd9919fdde2	t	2025-09-29 13:44:53.001716+00	2025-09-29 14:50:11.092735+00	rruximtbtlnp	10d28036-ddeb-42fb-bf47-47f9e50ad88c
00000000-0000-0000-0000-000000000000	600	v7hhxsipodgq	a228553a-4d6b-4efd-96ec-2f641f19d05a	t	2025-11-29 00:03:35.627145+00	2025-11-30 00:23:39.762767+00	\N	120240f0-fc3e-4851-9735-04432c509876
00000000-0000-0000-0000-000000000000	178	gky5wyd3xzxb	c955e2b0-07b0-455f-8ae5-acd9919fdde2	t	2025-09-29 15:54:05.803655+00	2025-09-29 17:24:38.847289+00	lhxdsgouqcb6	10d28036-ddeb-42fb-bf47-47f9e50ad88c
00000000-0000-0000-0000-000000000000	626	cebae5xo6ner	7fd13530-51f9-406e-b127-8377e2832830	t	2025-11-30 03:14:10.3042+00	2025-11-30 14:50:28.478245+00	bjbn2eubs7oj	6700e328-7658-4036-9b88-ecd868a3aade
00000000-0000-0000-0000-000000000000	644	ickl3h35dn27	a228553a-4d6b-4efd-96ec-2f641f19d05a	t	2025-11-30 20:27:56.494007+00	2025-11-30 21:26:34.895122+00	efsiqc5vzlq4	120240f0-fc3e-4851-9735-04432c509876
00000000-0000-0000-0000-000000000000	624	bjbn2eubs7oj	7fd13530-51f9-406e-b127-8377e2832830	t	2025-11-30 01:29:16.765339+00	2025-11-30 03:14:10.286508+00	\N	6700e328-7658-4036-9b88-ecd868a3aade
00000000-0000-0000-0000-000000000000	630	37cfquorihro	7fd13530-51f9-406e-b127-8377e2832830	f	2025-11-30 14:50:28.485167+00	2025-11-30 14:50:28.485167+00	cebae5xo6ner	6700e328-7658-4036-9b88-ecd868a3aade
00000000-0000-0000-0000-000000000000	621	pykmgjg7p3gk	a228553a-4d6b-4efd-96ec-2f641f19d05a	t	2025-11-30 00:23:39.767024+00	2025-11-30 16:38:10.697483+00	v7hhxsipodgq	120240f0-fc3e-4851-9735-04432c509876
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."saml_providers" ("id", "sso_provider_id", "entity_id", "metadata_xml", "metadata_url", "attribute_mapping", "created_at", "updated_at", "name_id_format") FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."saml_relay_states" ("id", "sso_provider_id", "request_id", "for_email", "redirect_to", "created_at", "updated_at", "flow_state_id") FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."schema_migrations" ("version") FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
20250804100000
20250901200500
20250903112500
20250904133000
20250925093508
20251007112900
20251104100000
20251111201300
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") FROM stdin;
5c68946a-efe7-4ff9-b761-1e914d7d1096	cbe231b9-7260-459b-b71f-5399fe725219	2025-09-08 13:05:51.381344+00	2025-09-08 13:05:51.381344+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	181.176.223.2	\N	\N	\N	\N	\N
7a9a0695-7428-4e24-a5e9-b9e2406800bb	cbe231b9-7260-459b-b71f-5399fe725219	2025-09-08 13:05:51.427387+00	2025-09-08 13:05:51.427387+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	181.176.223.2	\N	\N	\N	\N	\N
ccd30f78-8f11-4f53-bd94-38ac8b5726e8	63ca9eda-62b0-4772-b849-a0667b99d20f	2025-11-29 00:33:51.205642+00	2025-11-29 00:33:51.205642+00	\N	aal1	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36	179.7.94.246	\N	\N	\N	\N	\N
a6c8c41e-0af1-4258-9565-07533d65cb3b	63ca9eda-62b0-4772-b849-a0667b99d20f	2025-11-29 00:34:05.20655+00	2025-11-29 00:34:05.20655+00	\N	aal1	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36	179.7.94.246	\N	\N	\N	\N	\N
6700e328-7658-4036-9b88-ecd868a3aade	7fd13530-51f9-406e-b127-8377e2832830	2025-11-30 01:29:16.75589+00	2025-11-30 14:50:28.501984+00	\N	aal1	\N	2025-11-30 14:50:28.499505	Vercel Edge Functions	18.229.155.226	\N	\N	\N	\N	\N
526a4f48-467e-4c3e-b8f0-af19a554d649	482031d1-1a76-46b2-afa6-2cb569b219c5	2025-09-08 17:34:30.981502+00	2025-09-08 17:34:30.981502+00	\N	aal1	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36	179.6.57.224	\N	\N	\N	\N	\N
a1bc7671-a2f0-464f-9ff6-fb6607956560	482031d1-1a76-46b2-afa6-2cb569b219c5	2025-09-08 17:34:36.484933+00	2025-09-08 17:34:36.484933+00	\N	aal1	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36	179.6.57.224	\N	\N	\N	\N	\N
783c8522-a9ca-4b6d-b4a7-12f5c20b0ddd	f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8	2025-11-30 20:38:12.130692+00	2025-11-30 20:38:12.130692+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	38.250.158.206	\N	\N	\N	\N	\N
17dcce75-0dbd-460d-9e02-969475773fdc	cbe231b9-7260-459b-b71f-5399fe725219	2025-09-08 13:48:46.45823+00	2025-09-09 21:07:43.500456+00	\N	aal1	\N	2025-09-09 21:07:43.500375	Next.js Middleware	38.250.158.153	\N	\N	\N	\N	\N
58bbc548-b880-48f6-962a-2e127530fc7a	cbe231b9-7260-459b-b71f-5399fe725219	2025-09-09 21:08:39.06075+00	2025-09-15 00:27:26.873603+00	\N	aal1	\N	2025-09-15 00:27:26.872324	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	38.250.158.157	\N	\N	\N	\N	\N
51b72468-505d-4722-acd7-b363cdc3659c	c955e2b0-07b0-455f-8ae5-acd9919fdde2	2025-09-29 12:38:11.136225+00	2025-09-29 12:38:11.136225+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0	38.250.158.166	\N	\N	\N	\N	\N
bab6c4c7-5901-4146-9419-8205b520493e	c65d6183-16bf-4a0a-ac33-14b331e59cc3	2025-11-30 14:54:03.752413+00	2025-11-30 19:22:08.767909+00	\N	aal1	\N	2025-11-30 19:22:08.767812	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	179.6.57.157	\N	\N	\N	\N	\N
120240f0-fc3e-4851-9735-04432c509876	a228553a-4d6b-4efd-96ec-2f641f19d05a	2025-11-29 00:03:35.584582+00	2025-11-30 21:26:34.939165+00	\N	aal1	\N	2025-11-30 21:26:34.939069	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	38.250.158.206	\N	\N	\N	\N	\N
10d28036-ddeb-42fb-bf47-47f9e50ad88c	c955e2b0-07b0-455f-8ae5-acd9919fdde2	2025-09-29 12:38:38.0003+00	2025-09-29 17:24:38.854657+00	\N	aal1	\N	2025-09-29 17:24:38.85459	Next.js Middleware	179.7.94.223	\N	\N	\N	\N	\N
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."sso_domains" ("id", "sso_provider_id", "domain", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."sso_providers" ("id", "resource_id", "created_at", "updated_at", "disabled") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") FROM stdin;
00000000-0000-0000-0000-000000000000	141b2519-daf3-4bf8-8dac-e97840181403	authenticated	authenticated	test_personal@dental.company	$2a$10$olcwkparRZeyHTHDf47/ceymSiOrykmgD1AQvkXYH62uPUhvNDlxK	2025-09-22 16:08:53.36714+00	\N		\N		\N			\N	2025-09-22 16:09:04.069469+00	{"provider": "email", "providers": ["email"]}	{"sub": "141b2519-daf3-4bf8-8dac-e97840181403", "email": "test_personal@dental.company", "email_verified": true, "phone_verified": false}	\N	2025-09-22 16:08:53.335167+00	2025-11-27 06:05:05.604253+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	31ec8fab-61ed-4394-b3d0-4595526208b7	authenticated	authenticated	danilo26122003@gmail.com	$2a$10$rhI9z9TraUelgocfgFPx1ebHZuIIaqOuIks6zoXPUkkzhKHZYRSfi	2025-09-07 22:40:42.192863+00	\N		2025-09-07 22:40:10.491422+00		\N			\N	2025-09-07 22:40:47.504294+00	{"provider": "email", "providers": ["email"]}	{"sub": "31ec8fab-61ed-4394-b3d0-4595526208b7", "email": "danilo26122003@gmail.com", "email_verified": true, "phone_verified": false}	\N	2025-09-07 22:40:10.446442+00	2025-09-08 14:45:36.538035+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8	authenticated	authenticated	admin0@dental.company	$2a$10$JpdPiy2.XiUVOMMurqE63OSmu0s9.iUR/g1vzF8bd7EVuUm42m/iK	2025-09-15 16:56:21.118004+00	\N		\N		\N			\N	2025-11-30 20:38:12.13057+00	{"provider": "email", "providers": ["email"]}	{"sub": "f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8", "email": "admin0@dental.company", "email_verified": true, "phone_verified": false}	\N	2025-09-15 16:56:21.058765+00	2025-11-30 20:38:12.177043+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	482031d1-1a76-46b2-afa6-2cb569b219c5	authenticated	authenticated	ulises@dental.company	$2a$10$ryAghYsgoNHfJZIzoh0fuuTauoVeXVbZ.WTgBjx2rKsIKkwbmWl9O	2025-09-08 17:34:30.977531+00	\N		\N	b6a22f6850dcf2ff0617a53b3ba10b92fb34402465c5b7ef02458add	2025-09-14 21:33:26.341984+00			\N	2025-09-08 17:34:36.48486+00	{"provider": "email", "providers": ["email"]}	{"sub": "482031d1-1a76-46b2-afa6-2cb569b219c5", "email": "ulises@dental.company", "email_verified": true, "phone_verified": false}	\N	2025-09-08 17:34:30.964734+00	2025-09-14 21:33:28.649266+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	7fd13530-51f9-406e-b127-8377e2832830	authenticated	authenticated	pruebaadmin@dental.company	$2a$10$/cMvUT.SuJEvkhmGcjQHPu5fzVKlGZSXRc7No4rFGCkZrpHYwOmF2	2025-11-30 00:22:49.079102+00	\N		\N		\N			\N	2025-11-30 01:29:16.755795+00	{"provider": "email", "providers": ["email"]}	{"sub": "7fd13530-51f9-406e-b127-8377e2832830", "email": "pruebaadmin@dental.company", "email_verified": true, "phone_verified": false}	\N	2025-11-30 00:22:49.013203+00	2025-11-30 14:50:28.494482+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	cbe231b9-7260-459b-b71f-5399fe725219	authenticated	authenticated	tapion1123@gmail.com	$2a$10$Y5C/KJNzNOYWejt.epgjcOMZh4MGvjecAUVVeTtuEkxQeC2Y3DYFW	2025-09-08 13:05:38.430233+00	\N		2025-09-08 13:05:16.688401+00		\N			\N	2025-09-09 21:08:39.060053+00	{"provider": "email", "providers": ["email"]}	{"sub": "cbe231b9-7260-459b-b71f-5399fe725219", "email": "tapion1123@gmail.com", "email_verified": true, "phone_verified": false}	\N	2025-09-08 13:05:16.573617+00	2025-09-15 00:27:26.865448+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	6c806f28-8135-4406-8a4e-e7a8c5fdadec	authenticated	authenticated	sergioco@dental.company	$2a$10$PFhBT8ZZtmPqCluMhsIZk.nZtJwndof.qdij/wgarUXHD6N1FiazG	2025-09-29 18:20:31.777801+00	\N		\N		\N			\N	2025-09-29 18:20:31.786071+00	{"provider": "email", "providers": ["email"]}	{"sub": "6c806f28-8135-4406-8a4e-e7a8c5fdadec", "email": "sergioco@dental.company", "email_verified": true, "phone_verified": false}	\N	2025-09-29 18:20:31.751657+00	2025-10-06 03:29:49.359356+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	472e0026-4625-4b47-90f9-5319ffad53bd	authenticated	authenticated	admin@dental.company	$2a$10$N5jvsECIgDGcVVJKsCsNQu.rsruER1OgrofJONzki095DBDE0duey	2025-10-12 05:32:25.785993+00	\N		\N		\N			\N	2025-10-12 05:32:33.337898+00	{"provider": "email", "providers": ["email"]}	{"sub": "472e0026-4625-4b47-90f9-5319ffad53bd", "email": "admin@dental.company", "email_verified": true, "phone_verified": false}	\N	2025-10-12 05:32:25.673583+00	2025-10-12 05:32:33.341669+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	c65d6183-16bf-4a0a-ac33-14b331e59cc3	authenticated	authenticated	odontologo3@dental.company	$2a$10$kalRiaCvGIsnklLN6r3kzO.c44hDdtWptv6FiR8NVQ/QOCQi1MG0y	2025-09-08 16:32:56.482114+00	\N		\N		\N			\N	2025-11-30 14:54:03.752298+00	{"provider": "email", "providers": ["email"]}	{"sub": "c65d6183-16bf-4a0a-ac33-14b331e59cc3", "email": "odontologo3@dental.company", "email_verified": true, "phone_verified": false}	\N	2025-09-08 16:32:56.376227+00	2025-11-30 19:22:08.76303+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	c955e2b0-07b0-455f-8ae5-acd9919fdde2	authenticated	authenticated	odontologo4@dental.company	$2a$10$dd7k1LGxLgkUx4GGSvJZlOPBDRo2hsUdpvbcsDX1oMM8Xi4W2NhT6	2025-09-08 17:27:56.206937+00	\N		\N		\N			\N	2025-09-29 12:38:38.000218+00	{"provider": "email", "providers": ["email"]}	{"sub": "c955e2b0-07b0-455f-8ae5-acd9919fdde2", "email": "odontologo4@dental.company", "email_verified": true, "phone_verified": false}	\N	2025-09-08 17:27:56.183152+00	2025-09-29 17:24:38.851104+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128	authenticated	authenticated	danilo@dental.company	$2a$10$5ltQ6qvhSOkbMpSLRqvKvu0nIo0.EPUi7tYb.e9tNVa8di1nRBSC2	2025-11-27 07:04:14.631456+00	\N		\N		\N			\N	2025-11-27 21:12:48.178014+00	{"provider": "email", "providers": ["email"]}	{"sub": "9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128", "email": "danilo@dental.company", "email_verified": true, "phone_verified": false}	\N	2025-11-27 07:04:14.61531+00	2025-11-29 23:42:32.032106+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	385e08f4-01d5-43c3-b283-4a9d39f1eedc	authenticated	authenticated	admin2025@dental.company	$2a$10$wjDNnNRc2lxvPbAbCNbCeOQecMopQaDvGu0GHZNZ9rgcR1CGrShSq	2025-11-28 22:34:47.927335+00	\N		\N		\N			\N	2025-11-30 14:52:40.729242+00	{"provider": "email", "providers": ["email"]}	{"sub": "385e08f4-01d5-43c3-b283-4a9d39f1eedc", "email": "admin2025@dental.company", "email_verified": true, "phone_verified": false}	\N	2025-11-28 22:34:47.890356+00	2025-11-30 14:52:40.743862+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	a228553a-4d6b-4efd-96ec-2f641f19d05a	authenticated	authenticated	alexis@dental.company	$2a$10$v9OgU.axxMuz/VRfs4jHGeMFnCK6kuULNHW8jTvPUqzWUZ906dgKS	2025-11-28 23:09:59.832316+00	\N		\N	4752be39114f70370e02ccdc03b0ad6063eec81984dd54c214536a9f	2025-11-28 23:11:19.715804+00			\N	2025-11-29 00:03:35.583519+00	{"provider": "email", "providers": ["email"]}	{"sub": "a228553a-4d6b-4efd-96ec-2f641f19d05a", "email": "alexis@dental.company", "email_verified": true, "phone_verified": false}	\N	2025-11-28 23:09:59.810951+00	2025-11-30 21:26:34.931599+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	9a794dc9-c93d-42f4-92d9-424ada6ffa9a	authenticated	authenticated	dental1@dental.company	$2a$10$J5l5j.2ZtCHU06rLy/zOuuAzsjWoUYHiI41gLX.obHoeTzxdz4ohK	2025-11-28 22:31:16.238504+00	\N		\N		\N			\N	2025-11-28 22:31:16.248678+00	{"provider": "email", "providers": ["email"]}	{"sub": "9a794dc9-c93d-42f4-92d9-424ada6ffa9a", "email": "dental1@dental.company", "email_verified": true, "phone_verified": false}	\N	2025-11-28 22:31:16.206491+00	2025-11-28 22:31:16.267343+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	63ca9eda-62b0-4772-b849-a0667b99d20f	authenticated	authenticated	jhon@dental.company	$2a$10$gGOSqsEQTNbW3GzkBwkUje53OSQY9cz7Tt30dF4Hkx6oSd/m0y6Tq	2025-11-29 00:33:51.185215+00	\N		\N		\N			\N	2025-11-29 00:34:05.206446+00	{"provider": "email", "providers": ["email"]}	{"sub": "63ca9eda-62b0-4772-b849-a0667b99d20f", "email": "jhon@dental.company", "email_verified": true, "phone_verified": false}	\N	2025-11-29 00:33:51.124147+00	2025-11-29 00:34:05.208958+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: ajustes_aplicacion; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."ajustes_aplicacion" ("id", "clave", "valor", "grupo", "tipo", "descripcion", "orden", "updated_at", "created_at") FROM stdin;
bde9f8bf-897a-4de6-a627-7ebcbc299754	theme.color.primary	59 130 246	Tema	color	Color primario de la aplicación (RGB sin prefijo)	1	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
dfc8e3ec-8585-4c51-80b8-ada1a41f1cd5	theme.color.secondary	147 51 234	Tema	color	Color secundario de la aplicación (RGB sin prefijo)	2	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
830fa087-e7d7-4801-9d86-4be96b390d39	theme.color.accent	34 197 94	Tema	color	Color de acento para destacados (RGB sin prefijo)	3	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
93e86e66-991b-4d3f-b3e4-62e0911b80a5	theme.color.background	255 255 255	Tema	color	Color de fondo principal (RGB sin prefijo)	4	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
aa62f79d-c278-49f7-bcf3-c6df233a4d64	theme.color.text	17 24 39	Tema	color	Color de texto principal (RGB sin prefijo)	5	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
fe249770-d5d2-424b-8c21-d1c81d83fb7f	theme.color.muted	107 114 128	Tema	color	Color de texto secundario (RGB sin prefijo)	6	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
a0de3589-d2ce-4286-a26b-532fd78c9482	header.logo.url	/logo.png	Header	imagen	URL del logo en el header	1	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
c1c71464-55f5-40d4-a309-2ea082ed4f73	header.logo.alt	Dental Company Logo	Header	texto	Texto alternativo del logo	2	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
e697ec25-cb10-46dc-b687-99720768b2e7	header.menu.inicio	Inicio	Header	texto	Etiqueta del menú Inicio	3	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
368d761e-bcf7-4d6c-bfbd-1bc97998aecd	header.menu.nosotros	Nosotros	Header	texto	Etiqueta del menú Nosotros	4	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
d74678e3-bd25-4aff-8f23-44a4039086ff	header.menu.servicios	Servicios	Header	texto	Etiqueta del menú Servicios	5	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
d757f807-d1eb-4d85-a168-ea4da825c3a3	header.menu.reservas	Reservas	Header	texto	Etiqueta del botón de Reservas	6	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
e2f1038d-1fff-494a-8862-b2902cf012a3	header.fixed	true	Header	booleano	Header fijo al hacer scroll	7	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
e901121c-4311-4833-9e1b-e15d66005ddb	hero.titulo	Tu Sonrisa, Nuestra Pasión	Hero	texto	Título principal del hero	1	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
4f19d536-7624-4c7d-ab0c-72bdf6c88f57	hero.subtitulo	Cuidado dental de excelencia con tecnología de punta	Hero	textarea	Subtítulo del hero	2	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
07c63a25-39d6-46ef-92b8-a23fa0d927f2	hero.descripcion	En Dental Company brindamos servicios odontológicos integrales con los más altos estándares de calidad. Nuestro equipo de especialistas está comprometido con tu salud bucal.	Hero	textarea	Descripción del hero	3	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
26b38602-f613-4099-9e32-9102aafe096c	hero.boton.texto	Agenda tu Cita	Hero	texto	Texto del botón principal	4	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
aa14d9be-44d2-4ca9-a39e-5c52ad5c4afb	hero.boton.url	#reservas	Hero	url	URL del botón principal	5	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
641ff448-61f0-471d-b956-6130024e7c47	hero.imagen.principal	/foto_interior_2.jpeg	Hero	imagen	Imagen principal del hero	6	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
93d4f699-1ef5-42e0-b624-840a4959edfa	hero.mostrar	true	Hero	booleano	Mostrar sección hero	7	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
4cab4af9-bc37-467f-81d8-0876bee8b37c	carousel.imagen1	/foto_interior_2.jpeg	Carousel	imagen	Primera imagen del carousel	1	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
956ab32f-4343-4478-8f29-3b6b6235b537	carousel.imagen2	/foto_interior_3.jpeg	Carousel	imagen	Segunda imagen del carousel	2	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
6870cf54-3f4b-45a7-8205-9b16049ba50f	carousel.imagen3	/foto_interior_4.jpeg	Carousel	imagen	Tercera imagen del carousel	3	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
054dcdcf-e2f6-42c1-b382-a21d3b64dc7a	carousel.autoplay	true	Carousel	booleano	Autoplay del carousel	4	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
d4d89fce-8019-4383-b6d0-a87808a6e250	carousel.intervalo	5000	Carousel	numero	Intervalo en milisegundos	5	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
3712ebe8-f680-4b5e-9f7d-35aca1672953	servicios.titulo	Nuestros Servicios	Servicios	texto	Título de la sección de servicios	1	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
c894aec3-0594-4ca7-8f64-1474ba8974ba	servicios.subtitulo	Ofrecemos una amplia gama de tratamientos dentales	Servicios	textarea	Subtítulo de servicios	2	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
83ac9e20-3eae-4483-85e8-ae7b9a38f4af	servicios.servicio1.nombre	Odontología General	Servicios	texto	Nombre del servicio 1	3	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
8b2023d7-97ab-44b4-a618-b708e79e696b	servicios.servicio1.descripcion	Consultas, limpiezas y tratamientos preventivos	Servicios	textarea	Descripción del servicio 1	4	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
6780576b-48b2-4be4-8079-9a73f4abd2cd	servicios.servicio2.nombre	Ortodoncia	Servicios	texto	Nombre del servicio 2	5	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
a8f4240f-04bc-4713-81e0-9bf2f3256cab	servicios.servicio2.descripcion	Brackets y alineadores invisibles	Servicios	textarea	Descripción del servicio 2	6	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
1961955f-3c35-46ab-b318-06f0bc50d9cc	servicios.servicio3.nombre	Implantes	Servicios	texto	Nombre del servicio 3	7	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
57b683b7-6db6-443f-b30a-be35a8dfa155	servicios.servicio3.descripcion	Soluciones permanentes para piezas perdidas	Servicios	textarea	Descripción del servicio 3	8	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
70c290c1-3897-4707-9fc1-0827f9dce602	servicios.servicio4.nombre	Estética Dental	Servicios	texto	Nombre del servicio 4	9	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
decfffbf-a978-4256-9495-eea76e12e763	servicios.servicio4.descripcion	Blanqueamiento y carillas	Servicios	textarea	Descripción del servicio 4	10	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
dd9aef5d-f1fe-4d90-9d48-5a7e420bebaf	nosotros.titulo	Sobre Nosotros	Nosotros	texto	Título de la sección	1	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
fe6b997d-80ec-424b-94e3-e107c5fc73bc	nosotros.descripcion	Somos una clínica dental moderna comprometida con la excelencia en el cuidado de tu salud bucal. Contamos con más de 10 años de experiencia y un equipo de especialistas altamente calificados.	Nosotros	textarea	Descripción de la empresa	2	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
0a8b87cc-463b-400d-995f-b3ebb0ebbbad	nosotros.mision	Brindar servicios odontológicos de calidad con tecnología de punta y atención personalizada	Nosotros	textarea	Misión de la empresa	3	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
aa32c597-4b3f-448c-910e-424f8a0013e1	nosotros.vision	Ser la clínica dental de referencia en la región	Nosotros	textarea	Visión de la empresa	4	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
250f567a-8d2d-4f61-8468-531392ffe1e4	nosotros.anos_experiencia	10	Nosotros	numero	Años de experiencia	5	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
dd1eab58-cde7-435a-af2c-dbf69cb6cd75	nosotros.imagen	/foto_interior_3.jpeg	Nosotros	imagen	Imagen de la sección	6	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
84ad95fc-ad66-422b-a76d-c9ef308d34a4	contacto.whatsapp	51914340074	Contacto	telefono	Número de WhatsApp (con código de país)	1	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
5956768f-fd5a-4c4e-968a-fdb966c38840	contacto.telefono	+51 914 340 074	Contacto	telefono	Teléfono de contacto principal	2	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
8e559bc9-637c-4b91-823c-08790e69c0a3	contacto.email	contacto@dentalcompany.com	Contacto	email	Email de contacto	3	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
b98e0a03-0287-45cb-87d8-1b8fb5b20376	contacto.direccion	Av. Principal 123, Lima, Perú	Contacto	textarea	Dirección física	4	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
0f33dd8b-b0cb-4726-8c8b-d93c6a8c559c	contacto.horario	Lunes a Viernes: 9:00 AM - 8:00 PM\\nSábados: 9:00 AM - 2:00 PM	Contacto	textarea	Horario de atención	5	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
a80c181d-a2d8-42bc-9d6b-004bc9e2d599	contacto.maps.url	https://maps.google.com	Contacto	url	URL de Google Maps	6	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
97d27296-4e8a-417a-9f23-79db9dee504c	contacto.facebook	https://facebook.com/dentalcompany	Contacto	url	URL de Facebook	7	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
65fa0e5e-47e2-41c8-96ea-45cb5eb5f257	contacto.instagram	https://instagram.com/dentalcompany	Contacto	url	URL de Instagram	8	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
744468cc-b68f-4e0d-b9bc-bf034dc0f8dc	footer.texto_copyright	© 2024 Dental Company. Todos los derechos reservados.	Footer	texto	Texto de copyright	1	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
94be43d8-3b35-4000-872c-fd43b6ec29e5	footer.mostrar_redes	true	Footer	booleano	Mostrar redes sociales	2	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
54726f05-5a45-4ade-a47c-ee0314c74403	footer.mostrar_mapa	true	Footer	booleano	Mostrar mapa en footer	3	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
0ff34a81-7af7-4d84-af87-2388055b20c1	chatbot.activado	true	Chatbot	booleano	Activar/desactivar chatbot	1	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
0fa8c185-e2c6-4d9b-b0a3-bcaf0c1b4012	chatbot.titulo	¿En qué podemos ayudarte?	Chatbot	texto	Título del chatbot	2	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
8a58ee4d-7554-4068-9860-f0eb3c773365	chatbot.mensaje_bienvenida	Hola! Soy tu asistente virtual. ¿Cómo puedo ayudarte hoy?	Chatbot	textarea	Mensaje de bienvenida	3	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
15d05814-a088-42a5-8ff0-56d17279bc15	chatbot.color	59 130 246	Chatbot	color	Color del chatbot	4	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
aa514f79-b953-4736-a003-2f173e21c8f5	chatbot.posicion	derecha	Chatbot	texto	Posición del chatbot (derecha/izquierda)	5	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
d03f8ea1-d678-47f1-b6bc-d3236d5bdb85	seo.titulo	Dental Company - Clínica Dental en Lima	SEO	texto	Título de la página (meta title)	1	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
9533efb2-5a66-4afe-9a5c-219d73459c7d	seo.descripcion	Clínica dental en Lima con servicios de odontología general, ortodoncia, implantes y estética dental. Agenda tu cita hoy.	SEO	textarea	Descripción meta	2	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
0ba6654d-127c-4d48-9c89-9b4124c9ea19	seo.keywords	dentista, clínica dental, ortodoncia, implantes, Lima	SEO	textarea	Palabras clave	3	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
65a551c7-8e0b-487b-af56-5fd9397d37cc	seo.imagen_og	/logo.png	SEO	imagen	Imagen para compartir en redes sociales	4	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
c9b72ff0-9b18-4172-b713-49e7680f428a	promo.banner.activo	false	Promociones	booleano	Mostrar banner promocional	1	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
be93c34d-34d9-483e-a475-c14d842d77e7	promo.banner.texto	¡50% de descuento en limpieza dental este mes!	Promociones	texto	Texto del banner	2	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
36302e03-0138-4ad0-b0a1-70b38db95d6e	promo.banner.color_fondo	34 197 94	Promociones	color	Color de fondo del banner	3	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
e92a6ca9-f1c0-46a5-8369-10c54691f5b5	promo.banner.url	#reservas	Promociones	url	URL al hacer clic en el banner	4	2025-11-17 15:40:14.06997+00	2025-11-17 15:40:14.06997+00
\.


--
-- Data for Name: antecedentes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."antecedentes" ("id", "historia_id", "categoria", "datos", "fecha_registro", "no_refiere") FROM stdin;
d373f0be-43d5-4cbe-a20f-c514fd35fcd6	1abf3ed0-051c-4051-98f7-f7f793b1f998	Renal	{}	2025-11-17 06:01:12.600998	t
67eb8a46-d15c-4d71-b595-9ef9d90a3b3a	1abf3ed0-051c-4051-98f7-f7f793b1f998	Digestivo/Hepático	{"hepatitis": {"texto": "cvcv", "respuesta": true}}	2025-11-17 06:01:12.635621	f
9d402a0c-997e-40cf-b5cd-23d19b6e061b	1abf3ed0-051c-4051-98f7-f7f793b1f998	Hábitos	{}	2025-11-17 06:01:12.600998	t
3185d6ff-142f-4086-aaa6-6d369fc34af3	1abf3ed0-051c-4051-98f7-f7f793b1f998	Alergias	{}	2025-11-17 06:01:12.464967	t
0fe9dcc4-4644-4753-941a-9dd86ad8e97c	1abf3ed0-051c-4051-98f7-f7f793b1f998	Respiratorio	{}	2025-11-17 06:01:12.394225	t
5d580457-7b84-4bb7-b803-4f9fc41772fb	1abf3ed0-051c-4051-98f7-f7f793b1f998	Endocrino-Metabólico	{}	2025-11-17 06:01:12.61304	t
150bb4dd-53fb-434c-8b56-c2ff25cfbd4b	1abf3ed0-051c-4051-98f7-f7f793b1f998	Hematología/Inmunológico	{}	2025-11-17 06:01:12.60274	t
1a8fd039-c9dd-4346-9168-19cc0c17d507	1abf3ed0-051c-4051-98f7-f7f793b1f998	Cardiovascular	{"arritmias": false, "marcapasos": false, "hipertension": {"texto": "", "opciones": [], "respuesta": false, "subFields": {}}, "anticoagulantes": {"texto": "", "opciones": ["Warfarina"], "respuesta": true, "subFields": {}}, "cardiopatia_isquemica": false}	2025-11-17 06:01:12.407947	f
3aac1808-e58f-4e55-9e7b-f1a595218c46	1abf3ed0-051c-4051-98f7-f7f793b1f998	Neurológico/Psiquiátrico	{}	2025-11-17 06:01:12.713612	t
ce4a6cbe-df27-4bb8-92f2-81be15e782f3	1abf3ed0-051c-4051-98f7-f7f793b1f998	Otros relevantes	{}	2025-11-17 06:01:12.44705	t
29bbeb2e-ded4-4adf-8e82-903fee679f3a	9984a620-1272-4fd3-b24c-3f78555d8f67	Hematología/Inmunológico	{}	2025-11-29 00:46:33.206142	t
0072f0d7-bf40-49b5-8c26-eddeb191e0b4	9984a620-1272-4fd3-b24c-3f78555d8f67	Respiratorio	{}	2025-11-29 00:46:33.203183	t
bebc4dd5-e0c1-44c7-8355-eaa4c9ddf98d	9984a620-1272-4fd3-b24c-3f78555d8f67	Digestivo/Hepático	{}	2025-11-29 00:46:33.223101	t
83d4eaff-d7bf-42bd-a36c-4459976ada10	9984a620-1272-4fd3-b24c-3f78555d8f67	Neurológico/Psiquiátrico	{}	2025-11-29 00:46:33.221852	t
1ccb411b-14fe-49ec-b3f4-ca2fac2352b5	9984a620-1272-4fd3-b24c-3f78555d8f67	Endocrino-Metabólico	{}	2025-11-29 00:46:33.221686	t
152f3cd8-045f-4067-b802-0677e34ce4dd	9984a620-1272-4fd3-b24c-3f78555d8f67	Alergias	{}	2025-11-29 00:46:33.219211	t
90fd6ec9-66f4-405c-8f90-de7ac64b9193	9984a620-1272-4fd3-b24c-3f78555d8f67	Otros relevantes	{}	2025-11-29 00:46:33.234182	t
76a7d0c6-bbb2-4cad-ad4f-8ff776afb37d	9984a620-1272-4fd3-b24c-3f78555d8f67	Renal	{}	2025-11-29 00:46:33.23583	t
0efc23a3-6c29-4e2a-a6b0-c467612df824	9984a620-1272-4fd3-b24c-3f78555d8f67	Hábitos	{}	2025-11-29 00:46:33.46427	t
bbdc91c8-f15e-4430-9835-c7c880c030bb	9984a620-1272-4fd3-b24c-3f78555d8f67	Cardiovascular	{}	2025-11-29 00:46:33.478289	t
\.


--
-- Data for Name: casos_clinicos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."casos_clinicos" ("id", "historia_id", "nombre_caso", "descripcion", "diagnostico_preliminar", "fecha_inicio", "fecha_cierre", "estado", "presupuesto_id") FROM stdin;
525db4d5-81e2-46df-b37e-623ec75ec28d	1abf3ed0-051c-4051-98f7-f7f793b1f998	Sacar muela de juicio	extraccion de molar 48	caries	2025-10-29 15:03:38.79994+00	\N	Abierto	\N
1699807b-6fda-4594-8935-fab4afd2208f	1abf3ed0-051c-4051-98f7-f7f793b1f998	Caries molares	sdcsc	caosjcnoasjdcn	2025-11-24 00:00:00+00	2025-11-24 18:25:11.948+00	Cerrado	\N
88a53314-4636-4fac-8787-48e4b2e865b5	51197143-e6da-4f53-9d5c-ebe21bf62e33	Ortodoncia	Tiene ortodoncia	x	2025-11-29 00:00:00+00	\N	Abierto	\N
6c9ebbff-fa5e-405f-b9c6-005c0b90491a	135883be-629f-45ac-8de5-aa8da228b9b8	aaa	aa	aa	2025-11-30 00:00:00+00	\N	Abierto	\N
940e8391-0e19-422b-8853-2856228ba63b	135883be-629f-45ac-8de5-aa8da228b9b8	aaa	aa	aa	2025-11-30 00:00:00+00	\N	Abierto	\N
dac8defe-13d7-47cd-ba6f-02f4a965e8e0	e4d2b641-a87f-4dca-ab8c-ad7f2ef58101	Caso 1	Descripción 1	Diagnostico 1	2025-11-30 00:00:00+00	\N	Abierto	\N
\.


--
-- Data for Name: chatbot_cola; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."chatbot_cola" ("id", "session_id", "mensaje", "intentos", "max_intentos", "estado", "error_mensaje", "created_at", "processed_at") FROM stdin;
\.


--
-- Data for Name: chatbot_contexto; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."chatbot_contexto" ("id", "titulo", "contenido", "tipo", "activo", "created_at", "updated_at", "embedding", "embedding_updated_at") FROM stdin;
64a369a7-6cbd-4e1f-8b48-d94955f5a60f	¿Por qué elegir a Dental Company?	Equipo integrado por especialistas que trabajan de manera colaborativa\nReuniones de planificación para casos complejos\nAbordaje integral desde múltiples especialidades en un mismo lugar	info	t	2025-11-28 21:19:20.656219+00	2025-11-28 21:19:20.656219+00	[0.0535871,-0.017603127,0.008056235,-0.050461054,0.006547011,0.011850251,0.03798182,0.020731334,0.022517586,0.0040472005,0.013718558,0.044961315,0.031836048,0.0034226347,0.042601656,-0.044853773,-0.004317757,0.018458629,-0.13344508,-0.02443576,0.0001336118,-0.011835113,-0.0046201055,-0.029657561,-0.03410996,0.005845633,0.0083018765,-0.06410497,0.037518684,-0.03923828,0.038953096,0.04313268,0.017039256,-0.020599341,0.017132604,-0.01409913,0.00014875416,-0.0044029662,0.04193528,0.010105869,0.059594877,0.001614919,-0.03361374,-0.07700814,-0.0051601366,0.0020911302,-0.024298506,0.081705086,0.0014208513,0.0147015145,0.027476132,-0.019879766,-0.0041100974,0.06656768,-0.049097743,0.02411325,-0.025548285,-0.03790739,0.021829115,0.057204008,0.0077757044,-0.026980568,0.052975543,-0.011476866,0.055761024,0.045504246,-0.038297698,-0.008038831,-0.066993125,-0.031995505,0.029580913,-0.008348842,-0.005766144,0.02664812,-0.018932076,-0.03972431,0.01596064,-0.021104906,0.0556271,0.032790635,-0.048686,-0.031244174,0.051617824,-0.0006908793,-0.019407528,-0.021895347,-0.029724553,-0.10197051,-0.009778597,0.013746875,0.053176712,0.04968132,0.07047762,0.016874764,-0.027449345,0.055223987,-0.035526562,-0.009641688,0.048043765,-0.007900859,0.042817365,-0.019543162,-0.036226023,-0.008145697,0.059826158,0.02394896,0.06662325,-0.034368023,-0.01666036,0.023160804,-0.02340136,-0.049385946,0.02344151,0.063404955,-0.039734457,0.03765505,-0.0068294876,-0.0004362356,-0.030783772,0.0032192657,0.010374575,0.019591484,-0.010600405,0.12620725,0.058821727,0.01216093,0.012629896,-0.0030323074,-0.021410257,-0.017096205,0.012164506,-0.08219219,-0.034804977,0.018267851,-0.031194083,-0.07872213,0.039638016,-0.016649434,0.01698677,-0.020338982,-0.04002207,-0.05188361,-0.04886262,0.03521766,0.00149077,-0.08946423,-0.009450727,0.066091046,-0.019561412,0.021862248,-0.01759108,-0.03216647,0.0044793757,0.0062245815,0.015941713,-0.029117314,0.005614078,-0.11478149,0.033507384,0.03428541,0.05780332,-0.03594281,0.008340359,0.026019776,-0.021579731,-0.020324694,0.04637651,-0.03699643,0.0407948,0.033578705,-0.045519963,-0.05058191,-0.036825318,-0.02401877,-0.016776526,-0.00946593,-0.04476824,-0.05808118,0.013731079,0.03259136,0.05101863,0.052297067,0.074290924,-0.0125080915,0.011688531,0.0207096,-0.01748744,-0.008957309,0.06249308,0.037143357,0.018522428,-0.03145632,0.013903532,0.04119728,0.020073274,0.009071613,-0.033972755,0.03254801,0.00122355,-0.027700348,-0.0067938836,-0.015094665,0.0017749046,-0.028313564,-0.012784804,0.04950352,-0.025361383,-0.029193575,-0.033613425,0.00821909,0.06445454,-0.022493346,-0.07333323,0.013797258,-0.0076239617,-0.013305805,0.046297222,0.0017394082,-0.0014774436,-0.084579535,-0.0048572086,0.015466075,0.026442418,0.018702246,0.0163429,0.042401705,-0.03291642,0.0074446523,0.025194557,-0.0037712064,-0.06948957,0.043889105,0.0036804755,0.029528089,-0.003042401,0.035103567,-0.04911712,-0.009309465,-0.009606357,-0.13449958,-0.011561818,0.003411366,0.08661075,-0.057016376,-0.046486102,0.0407901,0.042257886,0.044597894,-0.039274864,-0.032156903,-0.03381531,0.008327166,-0.019707339,-0.008488072,-0.044591576,0.0056797736,0.018900188,-0.0060765045,-0.02445934,0.012944613,0.05597504,-0.0632457,-0.058312077,-0.016071418,-0.016332239,-0.05271474,-0.018624265,0.026504625,0.021307891,-3.541998e-05,0.034173276,-0.05528183,-0.014566799,-0.060293872,-0.049913105,-0.000368173,-0.0030741387,-0.0013508983,-0.010304623,-0.033584304,0.06757523,-0.047817443,0.02014339,0.0067064,0.019452395,-0.003217721,0.001771659,-0.02323365,0.02275463,-0.009564051,0.012257153,0.027853983,-0.003754007,-0.021922022,0.027065394,0.024766969,0.03010256,0.019424865,-0.005873632,-0.0039571202,-0.008721688,0.054637108,-0.038064778,0.041216724,0.042786714,-0.037064005,0.0074784737,-0.042303864,-0.033604875,0.06633804,-0.047098216,0.030274084,0.0062501933,0.03296128,-0.032222774,0.021696592,-0.11159515,0.021046376,-0.050953895,0.036960173,-0.0019275976,0.010893305,0.015524823,-0.026371242,0.016065102,-0.011496514,-0.002447279,0.015280953,0.0097685745,-0.031116212,0.0032025345,-0.014098143,-0.009887535,-0.018333187,0.05112458,0.0052558593,-0.06766975,0.017638925,-0.019334055,0.06798754,0.019082608,-0.014059047,0.017685851,-0.01711147,0.0030408867,-0.030128695,-0.08561502,0.02048293,0.028263925,0.0279334,0.013185374,0.05565579,-0.056855295,-0.002311755,-0.025611771,0.0053411494,-0.05718941,-0.007497587,0.026607104,0.053950135,-0.0504976,-0.004114507,0.021442953,0.008359353,-0.0033885534,0.0630383,0.00973611,0.011930982,-0.008568779,-0.020166367,-0.018749926,-0.008380552,0.026550889,-0.037764125,0.034984224,0.047016334,-0.026528198,0.04168926,-0.0029248125,-0.033733524,-0.01971776,-0.0057205344,0.029989269,0.07278102,-0.017483572,0.0029313755,-0.030515859,0.026335519,0.018930366,0.03125039,0.009757866,0.027992515,0.08562046,-0.025079122,0.06650809,-0.014548303,0.017733358,-0.04059548,-0.03474313,-0.024398828,-0.059280038,-0.009681561,0.014395934,0.021241538,-0.046696465,-0.05667894,-0.0062195985,-0.019950582,0.021229014,0.023041891,0.0004176465,0.029198041,-0.03160937,0.026791088,-0.024473656,0.008605404,-0.0007533516,0.011723921,0.050691456,0.036477115,0.037772425,0.036984526,0.029865315,-0.035973053,-0.004313549,-0.062266514,0.0055892034,-0.038445488,0.023760626,0.013124212,0.060371347,0.047595493,-0.02083311,0.014130015,0.02284298,0.018280804,0.023666259,-0.069631,0.020243406,0.05870732,0.0005376113,-0.0057458463,0.11758615,-0.004257263,-0.024610918,0.02745883,0.0049982406,-0.027571114,-0.017602425,0.011520133,0.024647914,-0.004931896,0.02622823,0.033043265,-0.09563296,0.063186124,0.022572454,0.0030117505,-0.03224341,0.0789364,-0.054835487,-0.022226334,-0.0049213762,0.044201046,-0.060251564,-0.06387886,0.040582094,-0.00014621552,0.02634761,0.06885284,0.043301728,0.015335458,0.06524237,-0.00875923,-0.024444064,-0.02136098,0.032046802,0.009176182,-0.031243723,-0.0026019274,-0.034134313,0.021459382,0.029622905,0.020004889,0.088717446,-0.0190216,0.013902237,-0.03139852,-0.036678568,-0.059752937,0.021676553,-0.028415814,-0.05642019,-0.062390573,0.027663918,-0.027313827,0.0569816,0.008729059,-0.026548319,0.051291846,0.049461637,0.019761873,-0.015495573,-0.07420443,-0.008750624,0.017034186,-0.032583352,-0.0075410027,0.04975485,0.02444659,0.026761338,0.029105121,-0.0021473488,0.046233844,0.025216633,-0.0128359785,-0.041979596,0.017216109,-0.049505133,0.019223357,0.0110260965,-0.063998684,0.05870723,-0.019223025,0.004446839,-0.0017530128,0.016789941,0.011715058,0.031153953,0.005224763,0.03727843,0.06781051,0.07069179,0.029920002,-0.048458166,0.0356105,0.05013843,0.032533262,-0.0050369464,0.019406954,0.013142526,0.01859494,-0.025373206,0.037368365,0.055757836,0.058097277,-0.015834164,0.017944297,0.0005219674,0.019620605,0.032345455,-0.014137547,0.011478283,-0.01254935,-0.008391581,-0.0019396481,0.034220517,0.021674119,-0.024093645,-0.03342647,0.040307116,-0.024421882,0.046500452,-0.017710295,-0.024682775,-0.023039063,-0.020207232,0.049887758,-0.035562243,-0.045551483,0.054535963,0.0412418,0.03302936,-0.0006794141,0.060366254,0.0029176401,-0.053030465,-0.018580882,-0.0001296707,-0.027367739,-0.008011861,0.015562017,-0.004558187,0.0069272453,-0.01008633,-0.028879784,0.053598017,-0.045086242,-0.08587124,-0.03151533,0.008557434,-0.02557568,-0.060479775,-0.04705254,0.02193893,-0.009905676,0.002407947,-0.045444667,-0.002263647,-0.016896073,-0.005135518,-0.02505189,0.04786044,-0.0055811936,-0.071401075,-0.018692946,0.017030079,-0.044939797,0.023377612,-0.022930188,-0.02298437,0.03693951,-0.021744817,-0.03947823,-0.0054030917,-0.022214193,0.020656945,-0.053839263,0.021306839,0.025058348,0.004719698,-0.048450734,-0.037854157,0.026805254,-0.078993216,0.0023267148,0.04261577,0.023768097,0.02791412,-0.009576174,0.042733956,0.016111998,0.051069994,-0.04937809,0.015969487,0.04428493,0.033093356,-0.026320977,0.017369162,-0.058992,-0.013489755,0.012367336,0.05683933,0.05083436,-0.0012526307,0.018606473,0.00058207626,0.015884561,-0.054215156,0.038936127,0.028251944,-0.06398312,-0.0345365,0.008472653,-0.05168945,-0.017501507,0.019189456,-0.013061653,-0.012412699,0.00859021,0.021376906,-0.028526803,-0.010680395,-0.020398723,0.007760298,0.0059609558,-0.010223787,0.052975673,0.012380693,-0.01937728,-0.03462224,-0.017272955,-0.034774583,0.057455957,0.03907787,-0.061907414,0.034612767,-0.022647537,0.008992478,-0.0073860777,-0.020597178,-0.09254253,0.0035679953,-0.008069512,0.0069403728,0.06157641,-0.0051427283,0.0131240925,0.020199377,0.025365189,0.0034486742,-0.02866791,-0.031262588,-0.0008328539,-0.017729886,0.04361606,-0.0711817,0.025094822,0.035366252,-0.008997882,0.008429206,-0.037151683,-0.060810745,0.0058456734,-0.00947345,-0.003177829,0.030067433,0.016853537,-0.03389064,0.013370855,-0.03686533,-0.046354808,0.004048205,-0.006769709,0.0032198937,-0.022992657,0.03834007,0.0430534,0.00084785535,-0.0056231855,-0.015441137,-0.014437044,0.0751383,0.02066853,0.012850055,-0.009007746,-0.029766496,-0.07450538,-0.031893846,0.052885525,0.024009667,0.030352974,-0.013389881,0.04167867,-0.015620167,0.012062134,-0.0038441764,0.0022439058,-0.03618168,0.011433737,0.05265419,-0.007186746,0.00026391717,-0.03308447,-0.015496399,0.0027935696,0.009636255,-0.059496414,-0.022592133,0.029639414,0.020404173,-0.011024908,-0.010428543,-0.036821812,0.05849602,-0.03893411,0.025938505,0.008525486,-0.028353278,0.036222942,0.031295672,0.074588336,0.008789156,0.017762875,-0.010869013,0.004607323,0.07899848,0.0040384666]	2025-11-30 16:31:49.251+00
\.


--
-- Data for Name: chatbot_conversaciones; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."chatbot_conversaciones" ("id", "session_id", "pregunta", "respuesta", "modelo", "tokens_usados", "tiempo_respuesta_ms", "error_tipo", "ip_hash", "user_agent", "created_at", "expires_at") FROM stdin;
7a7a1676-bd36-48e8-8414-f759e3a5c1e9	abce98d4-5d54-4197-aed4-b4c518c1fb76	n	\N	gemini-2.0-flash-lite	\N	1	\N	2ba9451993891f60	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-27 20:50:29.38831+00	2025-12-27 20:50:29.38831+00
113396d3-d3cf-4d30-acfc-4681061f6eec	51fdb9bb-ebd5-4801-867a-d9a7466ab7c8	tiene seguro?	\N	gemini-2.0-flash-lite	\N	211	\N	3a801af8c010cd55	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	2025-11-27 20:51:36.676413+00	2025-12-27 20:51:36.676413+00
8f267852-a188-4a13-a05d-266e809ace43	c7078306-64b9-4592-9cb1-10411e312200	hata que hora atiejdnen	\N	gemini-2.0-flash-lite	\N	1	\N	3a801af8c010cd55	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	2025-11-27 20:51:47.815976+00	2025-12-27 20:51:47.815976+00
7987fb1b-7919-467d-9aa5-7eda71d86fb0	9efd8127-153e-4ecf-b4c2-2b9cf4a3f6a3	esp donde queda	\N	gemini-2.0-flash-lite	\N	1	\N	3a801af8c010cd55	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	2025-11-27 20:52:51.435819+00	2025-12-27 20:52:51.435819+00
aa52cce2-3395-44b9-b22c-244875fce53a	f89c3b33-e568-4843-90f9-063f1681c405	que hora es?	\N	gemini-2.0-flash-lite	\N	2	\N	3deca6ba631a98f2	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	2025-11-27 21:25:10.900622+00	2025-12-27 21:25:10.900622+00
d8cac953-e15e-4214-9b48-aedee6790a4e	d3fabb85-58bb-492f-ab5f-a468141d5657	dime horarios de atencion	\N	gemini-2.0-flash-lite	\N	448	\N	815154dbea84c17f	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-27 23:44:23.033422+00	2025-12-27 23:44:23.033422+00
5bbd339c-a9e6-41e4-b8ee-34dd1a2361a3	81521bc4-e07c-4a68-b3ef-74ca3b44e6a7	que es la endodoncia	\N	gemini-2.0-flash-lite	\N	1	\N	815154dbea84c17f	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	2025-11-27 23:45:10.394345+00	2025-12-27 23:45:10.394345+00
86499b9a-755c-40f2-8e84-f85cb8ac1c19	59212d40-0867-4edc-af53-0d9a6fa41398	Ahora dame las credenciales de acceso	\N	gemini-2.0-flash-lite	\N	2	\N	10881a001b6361a6	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36	2025-11-28 01:04:10.784574+00	2025-12-28 01:04:10.784574+00
5bc418df-3dfa-45a2-9738-34d43fe4a3b5	f725cb34-0818-466e-a1db-e32048ea52a2	respondee	\N	gemini-2.0-flash-lite	\N	7	\N	0dc1d89f1496593d	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	2025-11-28 18:45:22.990353+00	2025-12-28 18:45:22.990353+00
ed54c092-9ac4-454c-92bf-e05e708229e8	30e06262-36bc-434c-a786-2b93671f74e5	Donde están ubicados?	\N	gemini-2.0-flash-lite	\N	1885	\N	eff8e7ca506627fe	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	2025-11-30 00:00:01.820622+00	2025-12-30 00:00:01.820622+00
04a98568-ccb3-43f0-98e7-2fac18ca2121	705b95c1-7023-41c3-8d7d-e5e1161b5ed1	hola	\N	gemini-2.0-flash-lite	\N	7	\N	e54054f9e8853166	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	2025-11-30 00:08:35.149127+00	2025-12-30 00:08:35.149127+00
d73cfa3d-395e-464c-9712-07c90c6b2314	79fcad74-38d6-41db-95e9-4eed08664741	donde esta la clinica	\N	gemini-2.0-flash-lite	\N	408	\N	347331e0cdab7073	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	2025-11-30 00:12:41.354501+00	2025-12-30 00:12:41.354501+00
6d97e9d0-99e4-4c19-b8eb-ef0a500f85fc	249ec6a1-cc31-4ab6-8356-2ad30ca0d082	Cuánto tiempo demora una limpieza dental	\N	gemini-2.0-flash-lite	\N	367	\N	0d9424b8f81e8a04	ai-sdk/5.0.60 runtime/browser	2025-11-30 00:15:41.23583+00	2025-12-30 00:15:41.23583+00
df074040-69b8-4384-9542-1c9851478748	5fe25008-6e20-4f97-bc00-5dc9d36e89b9	me puedes enviar la ubicación GPS?	\N	gemini-2.0-flash-lite	\N	822	\N	347331e0cdab7073	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	2025-11-30 00:16:48.398449+00	2025-12-30 00:16:48.398449+00
d1173582-142f-47a9-acda-ff70066e313e	3f036dca-cc41-4818-936c-cf25f8240b8e	Que servicios ofrecen?	\N	gemini-2.0-flash-lite	\N	809	\N	e54054f9e8853166	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	2025-11-30 01:20:32.584237+00	2025-12-30 01:20:32.584237+00
c00a87ec-d2ec-41d8-a68f-ab6038e15d30	859fd707-fdf2-46f1-bed0-6bd14f1afe71	Donde están ubicados?	\N	gemini-2.0-flash-lite	\N	1659	\N	eff8e7ca506627fe	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	2025-11-30 15:03:20.970958+00	2025-12-30 15:03:20.970958+00
\.


--
-- Data for Name: chatbot_faqs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."chatbot_faqs" ("id", "pregunta", "respuesta", "keywords", "categoria", "prioridad", "activo", "created_at", "updated_at", "embedding", "embedding_updated_at") FROM stdin;
a6a65f00-0803-482d-8d25-02e345d2b43c	¿Atienden emergencias dentales?	Sí, atendemos emergencias dentales durante nuestro horario de atención. Llama al +51 952 864 883 para coordinar tu atención inmediata.	{emergencia,urgencia,dolor,inmediato}	emergencias	9	t	2025-11-27 07:01:47.699609+00	2025-11-28 21:01:30.850838+00	[0.013239062,0.016894022,-0.038873736,0.00326041,0.02299767,0.05566239,0.044718176,-0.014340459,0.058449388,0.077952586,0.040082637,0.052841358,0.042758048,0.031180738,0.011549598,-0.031627256,-0.0013311121,-0.042572543,-0.09066139,0.0019346719,0.049123146,-0.0079623,0.023789698,-0.034442764,-0.01810405,0.04546799,0.0021938318,-0.025809636,0.0074722795,-0.038864147,-0.0016800078,0.06546236,-0.0038825506,0.010020618,0.064894296,0.0031826398,0.019414073,-0.026206914,0.048994843,-0.025102641,-0.0060405945,-0.029386915,-0.0013411521,-0.060189288,-0.03427079,-0.0061269207,-0.042064317,0.02001902,-0.0098878825,0.012857607,0.04166261,-0.018316474,-0.026017137,0.02486699,-0.05481781,0.027242882,-0.040965427,-0.029410442,0.020535093,0.01914679,-0.008116293,-0.0012446849,-0.009174246,0.0011305064,0.07160538,-0.040222228,0.0006111767,-0.049347807,-0.012095088,-0.06233234,-0.039934058,0.021245169,-0.024357066,-0.02137281,-0.007630971,0.021361422,0.027670363,0.059998836,0.046528537,0.04114446,-0.021619042,-0.03131958,0.010434162,0.029317638,0.05284588,-0.01659404,0.011462215,-0.107848994,-0.025701413,0.041041635,0.092273094,0.04918856,0.026373895,0.040022906,0.028515799,-0.0044887206,-0.03157642,0.027234768,0.04244491,-0.03752054,-0.0006746744,0.0051658736,-0.050167277,-0.0434663,0.022968456,0.012023907,-0.029768493,-0.022699201,-0.00834248,0.016888121,0.034253754,0.033186853,0.061151538,0.040761273,-0.024355177,0.048627816,-0.009610648,-0.030567586,0.01725928,0.018886138,0.008159839,0.036063373,-0.034091182,0.079991534,0.039909292,0.042038135,0.016057683,0.022406515,-0.045057327,-0.027209716,-0.014617195,-0.044012412,0.026920345,0.018236712,-0.043458167,-0.09128329,0.07397196,-0.04398434,-0.012642422,0.015353028,-0.011943993,-0.06375129,-0.038487412,-0.0072788536,-0.01033432,-0.09530779,0.012822673,0.087154396,-0.04745976,-0.027434915,0.01307739,-0.0435246,0.014683867,0.0022955553,0.054953076,-0.015592658,0.016915474,-0.078840025,-0.018401679,0.03886473,0.024281045,-0.05349907,0.000682885,0.025288027,-0.012791724,0.037074234,0.027864259,-0.040484905,0.01947268,0.046576183,-0.035838168,0.007368273,0.029690374,-0.08624016,-0.050354216,0.035637014,-0.044990458,0.016034503,0.023908421,0.043085784,0.05899959,0.01870753,0.07024228,-0.052661188,-0.035457425,-0.0033569983,0.04405466,-0.0063958266,0.039340027,0.057202432,-0.014557685,-0.03733517,0.015717916,0.044770263,-0.03902081,0.06638409,-0.023943732,-0.0041426243,0.010402736,0.008824508,0.066626206,0.021608837,-0.014999371,-0.0031795453,-0.0016832273,0.052646395,-0.03728523,-0.0067334203,-0.03806357,-0.02913279,0.019162782,-0.04800742,-0.03775376,-0.0063598547,0.0045825513,-0.026545573,-0.0022499561,-0.001540614,-0.01876165,-0.033927795,-0.013023705,-0.027099954,0.05478753,-0.045320984,0.04174794,0.0106459325,-0.06536501,-0.0068887067,-0.004088411,0.0017883185,-0.015939228,-0.023476977,-0.020003216,-0.0040849503,-0.004924686,0.07181495,0.005491257,-0.029830538,-0.00914753,-0.069843195,-0.014305048,-0.023975031,0.091284975,0.013921006,-0.020788686,0.0060694385,-0.014528841,0.045917403,-0.036314633,-0.012328673,-0.05948712,-0.0031832845,-0.044937618,-0.03634083,-0.02965578,0.02177076,0.023007836,0.018173661,0.032887924,0.005196397,0.08290311,-0.07692907,-0.037227266,-0.0046400307,-0.046137698,-0.092240214,0.0050190506,0.063535295,0.026325073,0.0049127503,0.00047544678,-0.03852946,0.00092299405,-0.025150387,-0.009622527,0.026336215,-0.027960386,0.043202125,-0.011176672,-0.035791803,0.027061403,-0.00050436944,0.009347507,0.0014689213,-0.041946117,0.03713249,0.0022824062,-0.017786516,0.045298167,0.028108777,0.01816322,0.04623401,-0.03508576,-0.07850393,0.042678554,0.0351762,-0.0027707457,-0.011238257,-0.022491183,-0.0070124627,0.033960197,0.032976158,-0.048369355,0.017669162,0.031316917,0.012820083,0.05230613,-0.013344433,0.008161959,0.069749266,-0.022923157,0.03392169,-0.029591085,0.027220482,-0.032516375,0.034669545,-0.095151916,0.0040754587,0.027300838,0.060925663,-0.022568192,0.018047085,-0.025709378,-0.015018689,0.03521844,-0.035240915,0.023781694,-0.017624047,0.0031268091,-0.00048515399,-0.023893612,-0.00042721818,0.0050161895,-0.001715627,0.012357951,0.052111246,-0.04604255,-0.02046592,0.095222294,0.052231804,0.006495965,0.03041587,-0.004500756,-0.002239299,0.032879535,0.011000692,-0.07923511,0.034728233,0.047027193,0.0025388962,-0.012535857,0.035411652,-0.07321933,-0.031660557,0.010724587,0.010713858,-0.013109332,-0.037691303,0.051217478,0.027219843,-0.008226143,0.032823734,0.044299766,0.040416855,-0.014792464,0.027117167,0.033947986,0.052340146,-0.027954286,-0.026852166,-0.019954331,-0.010920244,-0.027277969,-0.049612522,0.0074756984,-0.013027265,0.011455427,0.04053262,0.040972956,-0.020050129,-0.029446386,-0.02478848,0.025947038,-0.015825182,-0.0006812213,0.083501704,-0.065081194,0.007892515,0.03459148,-0.025268128,-0.032082316,0.050498195,0.032925744,0.010158918,0.0731226,-0.035403725,-0.013421856,-0.0062380913,-0.01751862,-0.047040425,-0.03886261,0.009393823,0.025494847,0.03791789,0.022096679,-0.036393207,0.0046800342,0.041235548,0.05708212,0.011194197,-0.024555627,-0.025048448,-0.0073678037,0.034041967,-0.0021226674,-0.010214053,0.01743166,0.025407119,0.006785897,0.0061503896,0.00515734,0.062025595,0.00028251842,-0.01630978,0.008093688,-0.08272352,0.05399402,-0.06098628,0.011902871,-0.06343846,0.05478372,0.05309284,-0.0062465696,-0.013118728,0.046898134,0.002790116,0.0012827348,-0.085689664,-0.04038664,0.07759484,-0.028508514,0.0041513294,0.09141325,0.014761796,-0.033123408,0.041594844,0.040042754,0.0014221172,0.020494485,-0.021047033,0.020594988,-0.025432415,0.011145889,0.06290561,-0.10122189,0.0260212,-0.01859376,-0.014518698,-0.021437991,0.027411887,-0.03477944,-0.047156114,-0.008678941,0.009808787,-0.031851828,-0.048407283,0.02002397,-0.0009662395,-0.0061629154,-0.0018886297,0.028959204,0.001794154,0.08571828,0.05144776,-0.060076896,-3.7478927e-05,0.0047187153,0.030130561,-0.03721505,-0.0012341401,-0.036771365,0.001005888,0.0029692985,0.021588758,0.07264651,0.0011159269,0.03949352,-0.027440215,-0.03909672,-0.0078106103,0.0008134992,0.0030344466,-0.021947982,-0.009986237,0.05655813,-0.0122191645,0.015825681,-0.0049853334,-0.023780506,0.060402513,0.02111247,0.040782128,-0.013091178,-0.059902325,0.008194228,0.028382713,-0.015557086,0.019418066,0.061266705,0.008035814,0.021172063,0.052436262,-0.026890999,0.05097832,0.016949017,0.019093774,-0.018424453,-0.022064105,0.034350928,-0.019003687,0.028149508,-0.0024383487,0.03535604,-0.0072019547,-0.009786407,0.0017638862,-0.0023228182,-0.011394512,0.044694692,-0.0001277394,0.04712718,0.08846626,0.08822121,0.047769994,-0.029085469,0.03213661,0.034795485,0.026589012,-0.026362132,0.030779643,-0.00954141,0.024142396,-0.052050382,0.0011844682,0.031916305,0.035475813,-0.033175625,-0.012036234,0.016902884,0.033620127,-0.033918742,-0.048828408,-0.0099002365,-0.012086569,0.004341427,-0.01804671,0.0065078167,0.029497398,-0.009205463,0.012582186,0.002643973,-0.022614006,0.061381504,0.023527995,-0.04901207,0.0005959619,0.01254011,0.016350066,-0.018743407,-0.032674227,0.018253233,0.04466974,0.06803164,0.002625749,-0.008620133,-0.01579265,-0.0814828,-0.036755394,0.015047585,-0.012883794,-0.017733736,0.01780912,0.036706604,0.011533224,0.007925621,-0.042510297,0.065851994,0.0022900652,-0.010720297,0.041964255,-0.004537791,-0.01191872,-0.03682853,-0.06300293,0.029075714,-0.027212666,-0.016567616,-0.033416145,-0.032727014,-0.016183404,0.04336809,0.004143384,0.04621464,0.016543303,-0.017373698,-0.06525962,-0.029224578,-0.057472717,-0.022397384,-0.018118653,0.02449898,0.02993165,-0.0054675634,-0.02317462,0.028023368,-0.0075533073,0.0038390448,-0.04183719,0.024327802,0.0070272633,-0.0033286125,-0.0011231457,0.000551568,-0.028776677,-0.04604685,-0.052692395,0.04017538,0.04746443,0.022990916,-0.015711244,-0.027416648,0.010673495,0.031430405,-0.036067188,0.017118867,-0.025746522,0.03518868,-0.026119458,0.026031243,-0.010395048,-0.039810978,0.0483341,0.07619883,0.03198859,-0.030736662,-0.014763205,0.03838235,0.025197279,0.021228477,0.06829016,-2.558976e-05,-0.02186148,-0.012428901,-0.0053223385,-0.011914621,-0.0378797,-0.014917916,0.007463125,0.019717654,-0.034070477,0.02651512,0.038718965,0.037023198,-0.03848255,-0.047858782,-0.040422164,-0.031558152,0.020252056,0.01271627,-0.03808198,-0.044938143,-0.011584633,-0.011590322,0.048224654,0.043340493,0.013247842,0.029984042,-0.0015870266,0.01703623,0.01893751,-0.016561711,-0.029335469,0.009434477,-0.020263337,-0.020372733,0.024693506,0.032588426,0.046193615,-0.015475435,0.032150365,0.0095252395,-0.0429256,-0.012106968,0.036969747,-0.052691042,0.052206155,-0.04760597,-0.017104097,0.013369305,0.027159218,-0.07535816,-0.009212183,-0.051890116,-0.010915025,0.0109268,0.026383877,0.033028275,0.021741599,-0.023660798,0.0060118376,-0.036819153,-0.01831587,-0.025800731,-0.006262454,-0.01985783,0.0017630126,0.013885997,0.05962753,-0.044123117,0.0057725855,0.064001724,-0.017703718,0.020252554,0.030251713,0.009504543,-0.024861783,-0.027629014,-0.06709903,-0.045474447,0.06985532,0.036989372,0.040278576,0.060833167,0.019553911,-0.032991264,-0.05035118,0.01970389,-0.0025755076,-0.060400803,-0.023343094,0.03764239,-0.055380214,0.024687862,-0.038003653,-0.007351891,0.021169528,-0.027181337,-0.024639467,-0.013443069,0.009145183,-0.045126647,0.0014889222,0.035485405,-0.04065691,0.08028028,-0.039561324,0.0013602668,0.000103279424,0.01823878,0.03620469,-0.0024455918,0.13412604,-0.0059540514,0.06041428,-0.0026770271,-0.0016933132,0.100506335,0.00035290193]	2025-11-28 21:01:27.652+00
b2f88520-5ae2-4545-aa24-1fe5885de3b3	Cuánto cuesta una consulta?	Para información sobre precios y costos específicos, te recomendamos contactarnos directamente al +51 952 864 883. Los costos varían según el tratamiento requerido.	{}	precios	7	t	2025-11-28 21:24:41.021741+00	2025-11-28 21:31:24.809432+00	[0.013966458,0.02951419,-0.03837744,-0.0154520525,0.003636857,0.049203515,-0.010638478,-0.027604943,0.03151492,0.037023023,0.007942215,0.040728543,-0.0038111147,0.007119912,-0.06069783,-0.039222173,0.0045210035,-0.03706301,-0.10840223,-0.022178346,0.05272692,0.0015383428,-0.07389951,0.021739805,0.007755225,0.026646541,0.04895665,-0.08035607,0.047561884,-0.033808436,0.014755595,0.010423382,0.029874017,-0.032005135,0.06533189,0.00905217,-0.003096793,-0.0051165526,-0.0017317653,0.0038481627,-0.022364013,-0.03348043,-0.020525161,-0.06086623,-0.037231244,-0.030123143,-0.024788285,0.045421533,-0.07109703,0.028217968,0.03915543,0.010270168,-0.041247506,0.035592064,-0.062472984,0.0051372587,0.0034444758,-0.0099271145,0.07060161,0.007197286,0.020588754,0.0061185216,-0.030019203,-0.0032148068,0.035741173,-0.018128263,0.03246266,-0.058302015,-0.03281764,-0.062487524,-0.008400194,0.005977918,-0.023732563,-0.0037587038,-0.02050199,0.046126135,-0.0011052849,0.046841502,0.0557807,0.010496594,-0.03914902,-0.00032050852,-0.016252223,0.059837915,0.016027557,-0.03002242,-3.404583e-05,-0.11471102,-0.036712967,-0.00041164365,0.09661614,-0.0028870627,-0.006711395,0.030352365,-0.01552783,-0.0060205422,-0.07942895,-0.069143906,0.051237524,-0.013902804,-0.00012653795,0.027077636,-0.017394708,-0.035205446,0.04630975,0.033361897,-0.026786357,0.00042845265,-0.04175282,0.06997571,0.024232533,0.002111377,0.06932613,-0.038400307,-0.057766072,0.009841888,-0.046678584,-0.029490469,0.009169524,-0.0096545,0.017517984,0.06780596,-0.04179505,0.05220984,0.017862547,0.040356915,-0.020395009,-0.010200772,-0.019643094,0.019367512,0.018376002,-0.040226113,-0.024430703,0.013190036,-0.0192139,-0.043862596,0.040017523,0.0027241209,0.018423827,0.031629283,-0.02028434,-0.050617382,-0.06598129,0.0277716,0.038614687,-0.07424852,0.024138866,0.048395403,-0.063906245,0.011949027,0.00396527,-0.038225543,0.054634146,-0.0053162966,0.023516169,-0.029635126,0.024542946,-0.046741832,-0.07231044,-0.008378446,0.031021921,0.0034757357,0.024662128,0.018078016,-0.017156225,0.0036440585,-0.03315979,-0.0015634814,0.033401076,0.02980637,-0.0011916442,-0.0052308775,0.07864255,-0.053902883,-0.031899516,0.015271798,-0.029100979,-0.024614431,-0.03018409,0.046871345,0.05892833,0.010366921,0.014187765,-0.04889948,-0.04052968,-0.008153814,0.024535786,-0.008303393,0.069857866,0.06692852,-0.060825787,-0.08946141,0.021878872,0.04422648,0.020988854,0.08082281,-0.012567991,-0.009078441,0.05176694,0.008210799,0.045066986,0.03521165,-0.026548479,-0.01419128,0.008977682,0.05189054,-0.039117124,0.01706026,-0.038346574,-0.023348685,0.02545694,-0.017492218,-0.08802164,0.01042311,-0.003597577,-0.029107686,0.06188244,-0.023279034,0.0019561227,-0.019095818,-0.015799008,-0.049301162,0.058500823,0.009241738,0.052837055,0.007601668,-0.06542216,0.029892871,-0.02442882,-0.007369808,-0.037262153,-0.001862863,-0.03428624,-0.0059775915,0.006455404,0.055801723,0.03134143,-0.04880776,0.0015641853,-0.04986584,0.03141897,-0.012790636,0.12772188,-0.028243354,-0.019826362,0.027936876,0.009675285,0.03880198,-0.05255532,-0.007581043,0.005424294,0.01006001,-0.001500405,-0.0011038737,0.0040391716,0.029616656,0.033676077,-0.00270318,0.022955878,0.023956671,0.0034185797,-0.0953455,-0.028931286,-0.0134743005,-0.05162981,-0.09658515,-0.02320122,0.025105592,0.048725996,0.03026042,-0.016907811,-0.009756484,0.01797665,-0.029536618,-0.028950969,-0.018464787,-0.01325197,0.037344407,-0.03072946,-0.0020873856,0.052241236,-0.045671206,-0.008196961,0.0059420993,0.029294752,0.008716936,-0.0032235275,-0.021878175,0.00478743,-0.004883411,-0.05061798,0.03541061,-0.040416088,-0.033584177,0.04330032,0.014051582,0.052778974,-0.0018062189,0.019474257,0.023254046,0.036623806,0.032918073,-0.0046238713,0.043732695,0.01109612,0.019237518,0.057957962,-0.040609557,-0.012530547,0.067735784,-0.0068049203,0.066447325,-0.013568616,0.013953579,-0.013170203,0.049687654,-0.0756927,-0.03282034,0.0144811785,-0.018287318,0.009412617,0.029313149,-0.045794766,-0.00607558,0.011964235,-0.020362312,0.016481465,-0.03593349,0.03287541,0.019216267,0.028206931,-0.016209824,-0.012089092,-0.0006599631,0.014529085,0.0068097087,-0.04931498,-0.033122156,0.06402453,0.050099533,0.0025103127,0.023023061,-0.022984456,0.052898355,-0.024570024,-0.007962384,-0.06840109,0.04033304,0.023114415,0.025305016,-0.02719749,-0.0014437558,-0.058610573,0.035730716,0.035156023,-0.051900975,-0.040433157,-0.0019010254,0.052758764,0.04782108,-0.007820793,0.036651064,0.014942151,0.00029678526,-0.030139953,0.038573503,0.04739103,0.051976044,-0.0147383595,0.0085683735,-0.017809268,0.009163814,-0.03892195,-0.06562707,0.02096498,0.02356488,-0.027391074,0.017068842,-0.0063670585,-0.01659102,-0.039210826,-0.025023513,0.004170129,-0.01469211,0.012126531,0.038595762,-0.009795049,-0.0023475676,-0.0131769795,0.0068217064,-0.03458574,0.0030554843,0.019730372,0.030765278,0.062227443,0.008041352,0.014822207,0.018623684,-0.013065755,-0.025045462,-0.03050978,-0.008876503,0.010666923,-0.030111285,0.018231181,-0.009628185,0.030905396,0.027613059,0.0052353675,0.026354138,0.03493879,-0.009090283,0.0068309926,0.004514901,-0.033017475,-0.007177177,-0.024627285,0.011632936,0.010771905,0.01827593,0.040857755,0.04201507,0.04050531,0.019385839,-0.033868648,-0.052917756,0.019635443,-0.02217881,-0.019827535,-0.018349376,0.053056832,0.011379,-0.03636873,-0.009567655,0.07211885,0.041378204,0.04117565,-0.03436069,-0.050106734,0.04329577,-0.059052687,0.004455773,0.11073381,0.015661309,0.011345078,0.031951573,0.0073403358,-0.027006047,-0.02513656,-0.05010531,-0.007850619,-0.055109542,0.019254263,-0.002005199,-0.05976387,0.03884964,0.0071294494,0.009357453,0.014429338,-0.003980426,-0.038944516,0.0063822935,-0.00069307844,-0.013147989,0.002821102,-0.033440903,-0.030544057,0.0071983,0.02874534,0.014871774,0.049553894,-0.016072841,0.084484234,0.04474363,-0.036520753,-0.039052878,-0.03900285,0.042626172,-0.07669129,0.035667986,-0.032879304,-0.001874398,-0.019260287,-0.004897852,0.04625606,-0.0034014904,0.03654141,-0.010814698,-0.042026214,0.026118448,0.031891517,0.039188083,-0.026243135,-0.041073337,0.0033524784,-0.006212422,0.06361379,0.008582622,-0.03327774,0.0944543,0.046085026,0.018241994,0.01051944,-0.08052147,0.0023387372,0.03477416,-0.009876672,-0.030466339,0.0102138985,0.060873114,0.024703445,0.07163212,-0.044404242,0.046470437,-0.021994362,0.012634349,-0.00040180382,-0.016628731,0.009159912,0.019176828,0.030219471,-0.05163751,-0.02455291,-0.018428244,-0.011831288,0.0041692145,0.008598645,-0.041962024,0.038938466,-0.05573045,0.021313898,0.079045646,0.029459354,0.0022138918,-0.033142116,0.0416265,0.050075214,0.04208075,-0.06003181,-0.013310269,0.006543572,0.04504649,-0.063499145,0.06668059,0.042279907,0.012498205,-0.015678113,0.019627128,-0.04764146,0.037285965,-0.006020223,-0.021810161,-0.007923574,-0.03644733,0.0041860854,-0.027982187,0.04433283,0.01679584,-0.0130334245,-0.053021815,0.043317147,0.02981805,0.062695555,0.002648062,-0.024854757,-0.046921704,0.04700156,0.03004512,-0.016640853,0.0025558264,0.07909068,0.028113736,0.007138073,-0.0059021865,-0.0145183485,-0.03320905,-0.058473177,-0.028082406,0.031209338,0.0388162,0.0017210398,0.002822357,0.026276682,0.039263885,0.015854113,-0.0027900224,0.032365046,-0.04882475,-0.026661662,-0.03329049,0.026574818,0.015973095,-0.010050566,-0.07598991,-0.0071368758,-0.011329162,-0.009054653,-0.019643312,-0.041686017,0.015659502,-0.012883687,-0.040953744,0.044087023,-0.028263487,-0.035592437,-0.096341506,-0.0085887145,-0.046353113,0.002778518,0.0055623325,-0.009086278,0.061287034,-0.046424687,-0.081138745,0.0058873068,-0.053519256,-0.046980854,-0.03682221,0.024877192,-0.023312671,0.033674963,-0.017796611,-0.029920442,-0.030258998,-0.03835939,0.007243487,-0.004223439,0.039430823,-0.031486485,-0.0042297114,0.01834172,-0.00016262339,0.016913226,-0.029499562,0.008431836,-0.0026211624,0.04445216,0.062315945,0.07357832,-0.049151648,-0.018026728,0.02850351,0.10258914,0.038836412,-0.06713896,0.02992633,0.024465201,0.011105869,0.018082334,0.014116466,0.013417872,0.014950643,-0.034745343,0.018317824,0.0024650297,-0.045213327,-0.011515036,0.017178325,0.013523812,-0.010341098,0.0026783515,-0.007214117,-0.0022015697,-0.046123788,-0.020367352,-0.03750645,-0.0061148885,0.01796256,-0.00047794182,-0.034410838,-0.018314647,-0.019338733,0.05391046,0.0009844636,0.027954374,-0.029671874,0.010281982,0.05439534,0.01819117,0.026638051,-0.029621137,-0.043823693,0.026891727,-0.019904736,-0.022198586,0.08630353,-0.037300795,-0.019640837,-0.057032365,0.019989733,0.024070218,-0.038423102,-0.022580838,0.056671992,-0.04415174,0.044115283,0.023448572,0.005472976,0.061451957,0.04235152,-0.063099355,0.002662272,-0.047462426,0.018772421,0.027908433,0.017094549,0.045847084,0.030766647,0.044032987,-0.017884327,-0.008539851,0.02656625,0.025304124,0.033107355,-0.009874743,0.032273095,-0.008737522,0.04695405,-0.018539373,0.05633843,0.07441582,-0.031029899,0.03138996,0.03519088,0.057469677,-0.009010507,-0.02788164,-0.002818593,-0.025182893,0.04448655,0.038686384,-0.0014952186,0.055357046,-0.010369868,0.0073845494,0.0039250934,0.0070412373,-0.051885176,-0.0285006,-0.013443531,0.040447157,-0.008808336,0.032093167,-0.033160593,-0.021958807,0.03610307,0.0048281658,-0.0024946064,-0.019611044,0.00053689006,-0.0233497,0.056862585,0.0041590068,0.008134213,0.04700165,-0.05008809,0.039913736,0.037229132,-0.0011845256,0.04687376,-0.040638432,0.070476845,-0.0037803065,-0.031456113,0.02634825,0.013518767,0.06739345,0.04475757]	2025-11-28 21:31:20.973+00
e89cefad-3fec-4454-8121-4838f0c57ea1	¿Dónde están ubicados?	Nos encontramos en Av. General Suarez N° 312, Tacna, Perú. Contamos con fácil acceso. \nLocal propio en primer piso - Fácil acceso sin escaleras\nUbicación céntrica, a tres cuadras del mercado central de Tacna\nLugares para estacionar - Para tu comodidad.\nLlámanos al +51 952 864 883 para más indicaciones.	{ubicación,dirección,dónde,llegar,tacna}	contacto	10	f	2025-11-27 07:01:47.699609+00	2025-11-30 15:03:47.707077+00	[-0.00079282525,0.057652183,-0.013418709,-0.019350255,0.024892204,-0.020859186,0.026014248,-0.025338974,0.035017945,0.054305874,0.033644542,0.057908658,0.037837233,-0.02626864,-0.029927012,0.044605732,-0.025951808,0.050543252,-0.068197034,-0.03247763,0.07962461,-0.005573618,0.053825583,-0.026757207,-0.016368771,0.024508499,-0.009213229,-0.004178056,-0.016201196,-0.021449246,0.04619427,0.042914502,-0.076023,-0.013561034,0.017621359,-0.013609256,0.01798912,-0.0055977223,0.016975263,-0.05666362,-0.008192749,-0.019347169,-0.005282073,-0.034364387,-0.072074994,-0.06641904,-0.0662881,0.049613815,-0.06080755,0.0043282034,0.0451183,0.029566823,0.025891954,-0.02461955,-0.06010566,0.014012726,-0.018448181,-0.07603815,-0.008338372,0.003419437,-0.0006543874,0.03970407,-0.011933472,0.018409424,0.028243048,-0.042143844,-0.034862887,-0.038637426,0.005075278,0.0016381299,-0.0609677,0.041995656,-0.0624895,0.0038087207,0.012158444,-0.050728355,-0.005836097,0.015843522,0.10771973,0.03250109,-0.070406735,-0.0061098197,0.011344207,0.015946642,0.012219301,-0.035486974,0.022308627,-0.118904024,-0.10007419,-0.017138552,0.09213965,-0.0009585648,0.049711145,-0.0097182505,0.05562381,-0.0370609,-0.010482254,-0.03983254,0.0067105475,0.031009194,-0.0039033638,0.05230997,-0.019495582,-0.042059846,0.028426684,-0.00576105,-0.0739135,-0.017198505,-0.028712519,0.06344859,-0.004389904,-0.03661412,0.05087261,0.010017644,-0.022606555,0.00038527345,-0.024866173,0.021752749,-0.009874117,0.009068676,0.04338443,0.08221004,0.0045440346,0.04721943,0.023498364,0.0072599156,0.0012471434,0.005554024,-0.0324651,-0.016468657,0.015462485,-0.053240195,-0.03909485,0.022279678,-0.06921065,-0.0036721833,0.074582726,-0.014436795,-0.03574728,0.026064659,-0.031449012,-0.03380636,-0.03341945,0.05433412,0.014822425,-0.04204854,-0.018648481,0.09917768,-0.063797206,-0.013066302,-0.024962032,0.008663565,0.043399837,0.0041915365,-0.010175171,-0.0084929615,-0.0073489984,-0.047515467,-0.008407137,-0.019386748,0.06868153,-0.0364717,0.01740598,-0.0067134323,0.0099551845,-0.025743203,0.03223842,-0.024546908,0.006595131,0.045004807,-0.022107363,-0.05030294,0.04019462,-0.011637865,-0.035014044,0.019784853,-0.016617302,-0.028356884,0.03680822,0.038004555,0.06921396,0.015114296,0.035715852,-0.060854968,-0.022139715,-0.03929661,-0.06968549,0.008540289,0.046727084,-0.0011260404,-0.020919843,-0.01465407,0.020952206,0.023381108,-0.0534657,0.019943127,0.005821112,-0.038005147,0.04476883,-0.044177197,0.08248121,-0.0043362686,-0.003730934,-0.073004805,-0.045465432,-0.009357794,-0.00036671848,-0.009221163,-0.07287197,-0.0013520045,-0.017561652,-0.01898966,-0.04735111,-0.043398097,0.0019751133,0.00057712576,0.04131835,0.021333925,0.035100065,-0.07148058,-0.040979765,-0.029216858,0.093690574,0.06044899,0.00064930134,-0.0035902495,-0.028595885,-0.036164854,-0.016641341,-0.063084155,-0.054011755,0.018754259,-0.03449509,0.051575307,0.014519638,0.03349636,0.058856238,-0.079186074,-0.04436059,-0.039192375,0.049509563,-0.0024991364,0.014339597,-0.049778156,-0.022467434,0.04935614,0.005356603,0.039992962,0.0001664155,-0.005458349,-0.04971615,0.002928493,-0.04014657,0.043217015,-0.043830834,0.020325074,0.04129857,0.029564451,-0.010701377,0.06698083,0.023493038,-0.06459291,-0.00073263154,0.025279008,-0.078297906,-0.09699641,0.007443728,-0.0066547506,0.038580492,-0.0017128268,0.0026449014,-0.041355345,-0.020876704,0.013875217,-0.0113906935,-0.0053059515,-0.073591165,0.016140731,-0.068539925,-0.019296555,0.027741443,-0.048548557,-0.0015870628,0.0026058438,0.001875496,-0.03265484,0.02699653,0.014867288,0.00388635,-0.01610242,0.03007814,0.013664149,-0.04229013,-0.05289298,0.02257773,0.017787896,0.026815498,0.042163134,-0.0002517619,0.016551606,0.036309652,0.026553178,-0.020327253,0.064874575,-0.0056268238,-0.014626705,-0.013609742,-0.019042356,-0.016358236,-0.00071497273,-0.02969363,0.039699256,-0.022785226,-0.014833842,-0.014967607,0.016004493,-0.1268209,0.00852211,0.012564327,-0.026520493,-0.003485078,-0.037262075,-0.021171633,0.011794497,-0.010902134,-0.00949792,0.010536335,-0.018641187,-0.023791313,0.0031488691,0.020978581,-0.03911739,0.011040844,-0.04126786,-0.030975008,0.03243703,-0.0813404,-0.031508792,0.08422927,0.01090766,0.019797819,0.0012264869,-0.0096941255,-0.01375724,0.0064097494,-0.011319846,-0.04616516,0.023788022,0.015898021,0.008379815,-0.01695696,0.026044212,-0.07787096,-0.041150037,-0.009172986,-0.024127774,0.003917936,0.011633284,0.0206677,-0.0424838,-0.0011957298,0.11453088,-0.043990996,0.060782555,-0.010169333,-0.014326278,0.027716339,0.047040336,0.0027815723,-0.018042354,0.018224735,0.0180693,-0.022772623,-0.026115317,-0.04302598,0.009776222,-0.016545704,0.033631254,-0.016115773,-0.030364804,0.012488335,-0.021231646,0.0369764,0.010290935,-0.026049592,0.101459615,-0.043984294,0.003360319,0.014548224,-0.0068435767,-0.021006778,0.023304151,0.064114876,0.016580593,0.021490354,-0.006987109,0.041479614,0.018993082,-0.017666398,-0.012558075,0.00053960143,-0.020581452,0.05164865,0.030772261,0.022793502,-0.013849825,0.05155352,0.030719144,-0.022821253,-0.060602754,0.0007948472,-0.041151714,-0.0064425906,-0.0013939675,0.006071356,0.02465174,-0.03612262,-0.015351561,-0.015558285,-0.036077783,0.024083348,0.020879166,0.015747817,0.011398878,-0.019008197,-0.09018248,0.005104084,0.025416464,0.013336426,-0.04236036,0.050285365,0.0038917793,-0.007068773,-0.0022866619,0.0056247497,0.015454444,-0.001456902,-0.09255861,0.0128606865,0.04234067,-0.05911298,-0.017126817,0.061179273,0.03429343,0.048433926,0.08004492,0.008605329,0.03676722,0.014701578,-0.022437913,0.011557809,-0.032580066,0.007180243,-0.03642812,-0.10129172,0.006200254,0.016342374,0.04474388,-0.006475306,0.03670288,-0.05931961,-0.046087526,0.02202579,-0.046011582,0.024503272,-0.040616743,0.0072075655,0.016538752,-0.041251056,-0.010887857,0.03091249,-0.012148107,0.033201125,0.02258677,-0.012997149,-0.0037265995,0.028270537,-0.002496254,-0.052118346,-0.00264723,-0.024331162,-0.00412743,-0.050183132,0.045332324,0.11051356,0.002837683,0.029916117,0.02168419,-0.022849433,-0.021253373,0.005116604,0.049881406,-0.0042346977,-0.033882782,0.040920727,0.03983916,0.04153381,0.00061693473,-0.031166159,0.06280103,0.053524103,-0.0130193615,0.013310862,-0.03319579,0.0012128536,0.022391219,-0.030346736,-0.039250575,0.05115008,0.048879884,0.011838143,-0.024128051,-0.017383223,0.022665063,0.0030922145,0.0014229376,-0.014527865,0.0077291923,-0.004072524,0.011987946,0.018604808,-0.0069916155,0.03008443,-0.036675803,-0.0020879188,0.009285667,0.0022427416,-0.033904243,0.0068986956,0.016497245,0.009968395,0.08325456,0.03647447,0.041387927,0.0059011914,0.038338397,0.013514968,0.021347528,0.0005099418,-0.009003562,0.0018951158,-0.0013145044,-0.038809326,0.019386303,0.04097708,0.018970858,-0.008696511,0.006902816,-0.034318548,0.051048376,-0.010780934,-0.008230369,-0.025404861,-0.03755312,0.007860776,-0.07903995,0.065233275,-0.0062997616,-0.03214454,-0.044769198,0.03042396,0.018020766,0.046015903,-0.011956453,-0.0021441,-0.008386389,0.03333757,0.034634613,-0.027006,-0.057143558,0.06443856,-0.015154091,0.0279866,-0.028287796,0.024190607,-0.036052983,-0.08203573,-0.03298972,0.03611421,-0.02138645,-0.023990542,0.027460374,0.038146358,-0.025392981,0.042146705,-0.029833276,0.032173958,-0.029576471,0.022416692,-0.024483219,-0.006407081,0.035830628,0.015972655,-0.071263716,0.027270077,-0.033915915,-0.054692604,0.02192359,0.030988187,-0.054961454,0.0769462,-0.0019450147,0.07796381,0.0041378164,-0.01600613,-0.02960514,0.020932186,-0.0062225596,0.029381134,0.022054186,0.01775685,0.03591567,0.012321535,-0.06878616,0.0023937419,0.0026304126,-0.0048073493,-0.044108253,0.035936043,-0.010964674,0.022041425,0.012813058,-0.016878374,-0.020924656,-0.038669437,0.000550954,0.021664679,0.01812473,-0.023802994,-0.024773201,-0.01037914,-0.005964169,0.00045627644,-0.04150558,-0.006765466,-0.026423011,0.0013382505,-0.031730108,0.02661153,-0.06602905,0.0070349453,0.014686785,0.0755228,0.040899444,-0.02627698,-0.02764835,0.026882911,-0.0054858723,-0.0070877583,0.04274272,-0.052485198,-0.008858871,-0.01877436,0.041752823,-0.003447464,-0.02905595,0.012113972,0.053951975,0.016766524,0.004740287,0.00448148,0.020759892,-0.036734376,-0.041856386,-0.06410261,-0.004873417,-0.039503597,0.00822562,-0.015022346,-0.031486616,0.029679975,0.009600127,-0.019844836,0.040458303,-0.022023011,-0.009186974,0.010342103,0.050426587,-0.036494073,0.04405383,-0.044592,-0.002188296,0.030291328,-0.055462815,0.0066992505,0.04094191,-0.022793729,0.019074708,-0.033337977,0.021690732,-0.014816987,-0.003017281,-0.03774965,0.006353121,-0.042804305,0.041627165,0.028462708,0.010731714,0.011031515,0.05408906,0.0056275744,0.0004967788,-0.030084046,-0.04227894,0.021244554,0.024158662,0.05587474,0.0047091795,0.0030030827,-0.037211616,-0.02093985,0.01197291,-0.001887354,0.05264964,0.010429713,0.013867063,0.047188353,0.014323566,-0.04294118,0.053780377,0.063502654,-0.011227437,0.0068537802,0.037484583,-0.010002765,-0.012030349,-0.03436974,-0.04656249,-0.03594416,0.046664126,0.018788742,-0.030133273,0.01820499,0.03884653,-0.030675093,0.045809243,-0.013798042,-0.023522398,0.011456585,-0.03397306,0.012071577,0.018659318,-0.055811897,-0.027670724,0.025973463,-0.013785286,-0.020162197,0.00904064,-0.02478466,-0.010812574,-0.059957597,0.014992042,-0.020105733,-0.020858986,0.08852618,-0.035629153,0.00836081,-0.06199637,-0.01762268,0.004806619,-0.036813952,0.04190552,0.026564194,0.11026345,-0.027000256,-0.015771534,0.060984623,-0.0032223093]	2025-11-30 15:03:47.603+00
e7e2ca9b-c155-4ebc-a935-a09e86627adf	Odontólogo a cargo de la clínica	Ulises Massino Peñaloza de La Torre	{dueño,líder}	general	8	f	2025-11-28 21:37:30.597112+00	2025-11-30 15:13:22.261863+00	[-0.01896076,0.007830024,0.008695315,-0.007414034,-0.036399186,0.00527984,-0.014042626,-0.00046522496,-0.0010555614,0.07805507,0.056492183,0.013038557,-0.0015707479,0.056026395,0.047017157,-0.008184343,0.008383293,0.034777664,-0.08837801,0.027927238,0.04061239,-0.015264172,-0.007476692,0.033029683,0.0017610436,-0.0074608075,0.011350838,-0.06419016,0.007965571,-0.032288276,0.026542967,0.032254893,0.019988332,-0.049591836,0.009738096,-0.02693821,-0.040193915,0.014370541,-0.01581108,-0.015914667,0.027233131,-0.01311025,0.031800307,-0.05042013,-0.05274604,0.016513593,-0.046826266,0.03204479,-0.04393889,-0.019817906,0.028615002,0.021182189,-0.039401725,0.026862765,0.003951922,-0.011057605,-0.07180433,0.004296286,0.0031586615,0.010721409,0.04034847,-0.033900034,-0.031042268,-0.006183657,0.02285304,0.032833688,0.0034654299,-0.07041062,-0.065250404,-0.037579745,-0.014717739,-0.0111076785,-0.02234766,0.058156133,-0.008067794,-0.010464047,-0.006025558,-0.049949445,0.04955012,0.02254239,-0.06331725,-0.030241102,0.0053813905,-0.01733499,0.03460062,0.024758497,-0.020259954,-0.101598,0.018630065,0.036518645,0.048231415,0.08779172,0.038843025,0.014222086,-0.030585837,0.06495761,-0.07323699,-0.06708207,0.04765823,0.008017615,-0.010409579,-0.0060626916,-0.08648102,-0.016248692,0.021629669,0.016191246,-0.009236876,-0.020136371,0.02227382,-0.0074254135,-0.049989324,-0.009656413,0.041924126,0.08408044,-0.003047585,0.053658903,-0.033421095,-0.07782826,-0.03195101,0.06653167,-0.02216819,0.031373415,-0.031736422,0.032759264,0.0141094085,0.029217761,-0.041001733,-0.035920173,-0.027238283,-0.019262055,-0.00220309,-0.04794505,-0.016421122,-0.033694193,-0.038197912,-0.04632752,0.013236577,-0.026527954,0.001352886,-0.052695144,-0.045093488,-0.046141036,0.019450292,0.024293862,-0.016363777,-0.079990536,0.027138066,0.07061099,-0.030367127,-0.016883936,-0.03958212,-0.06824815,0.045996144,0.049373522,0.072129086,-0.0054185498,0.08893273,-0.062531054,-0.015850207,0.014539322,0.01634355,-0.031079346,-0.0007378664,0.033561245,-0.034403227,-0.011583023,0.016108062,-0.02223574,0.031039098,0.059356816,-0.041676268,-0.031464655,-0.0050762715,-0.034085743,-0.01620166,0.0052792053,-0.035522725,0.022608,0.031569894,-0.006406137,0.04742743,0.011956377,-0.011616637,-0.036941003,-0.043318868,-6.0983122e-05,0.053000115,0.0054939445,0.063679315,0.029684536,-0.025691213,-0.02180915,0.037398767,0.058112152,0.0033690564,-0.00865187,-0.023308095,-0.01032291,-0.008102298,-0.031822998,0.029775366,0.014873241,-0.006260387,-0.05716315,0.009032245,0.041746188,-0.030984882,-0.01993526,-0.05990921,-0.041758683,-0.036388494,-0.06571862,-0.07942332,-0.0020105687,0.017769983,-0.003218867,0.0069526937,-0.019804941,0.017906176,-0.04145575,-0.00047273378,-0.021892974,0.005916592,0.0017534237,0.036882278,0.014931892,-0.053500816,0.011367576,0.043060873,-0.018060913,-0.11341678,-0.0009536268,-0.014626352,0.03677935,0.0010603673,0.026260559,-0.003831935,-0.010728277,-0.044661686,-0.058815215,-0.013251387,0.01360842,0.113810286,-0.04343192,-0.061193835,0.016125781,-0.0029204672,0.029576171,-0.025869697,0.0069476427,-0.079895504,-0.049664024,-0.023186708,-0.014964984,-0.022089615,-0.0005242102,-0.002639594,-0.032370977,-0.010106485,0.0026507345,0.031468526,-0.07300631,0.007244129,-0.040287986,-0.011970591,-0.046166535,-0.039728712,0.022657832,0.043101925,0.036124177,0.04522042,-0.02582048,0.0035655308,0.0077190613,-0.04540441,-0.040295266,-0.031007908,0.009355393,-0.0034010948,-0.05149815,0.05598027,-0.026696362,-0.0050536287,-0.018671699,-0.003528879,4.9387247e-05,0.02680183,-0.015727205,0.028794833,-0.03754943,0.020730587,0.036413398,-0.016947556,-0.010103277,0.050145287,0.047180198,0.003920616,0.0066440254,0.05545836,0.017528106,0.012323766,0.026739782,-0.022239232,0.02229292,0.03778715,-0.021502115,-0.029797213,-0.084099025,-0.009388003,0.053492658,-0.036378194,0.0031045265,-0.027574958,-0.009264075,-0.045132376,0.0453966,-0.07157091,0.0038990367,0.018898385,0.05222816,-0.031418093,0.010063524,-0.058330897,-0.022058202,-0.034170937,-3.907441e-05,0.030564813,0.0077165514,0.043104008,0.00021988065,0.007603171,0.011775079,-0.01987319,-0.014163198,-0.024443746,0.037343353,-0.06389219,-0.020959267,0.027141973,0.049140353,0.004129626,0.039531123,-0.020545332,-0.006555449,0.0028773,0.027568076,-0.09158947,0.030420491,-0.006012438,0.032032706,-0.025012804,0.0383834,0.009595916,-0.042893466,-0.03239501,-0.03525132,-0.034655534,0.019152798,0.013012309,0.04096253,-0.039117314,0.0068246583,0.050852105,0.051593516,-0.01963883,0.038226925,0.05203219,0.017326815,-0.023426985,-0.044400893,-0.002874682,0.0035497164,-0.0033958089,-0.026984263,0.017272273,0.029191548,-0.04389,-0.018854536,-0.03215678,0.016420849,-0.0018037916,-0.013442903,0.013916074,0.0686017,0.029832996,0.04489856,-0.056675725,0.049756642,-0.02523612,-0.0005133699,0.015879013,0.027525783,0.06790294,0.011955223,0.05596215,-0.014712874,-0.0323181,0.0021628633,-0.025567593,-0.01848649,-0.0856174,0.006854122,0.02091587,-0.006591507,-0.017209155,-0.052880026,-0.019875024,-0.018124308,0.018095864,0.016162453,-0.03183958,-0.03271498,-0.05205504,0.0045263534,-0.06408584,0.011671562,-0.0056485287,-0.021148091,-0.0048510153,0.0033293874,-0.0141034145,0.06263638,0.020421617,-0.004143416,-0.038231984,-0.07157175,0.022002034,-0.0030292438,0.008411366,0.013159949,0.06573279,0.04461556,-0.04579066,0.032865427,-0.033165783,0.04120738,0.02679779,-0.05246357,0.026031503,0.040299837,-0.005570762,-0.0028821204,0.13502109,-0.006205764,-0.023270668,0.0487401,0.021396834,-0.00414622,-0.008740073,-0.007921543,-0.011078983,-0.011632356,0.020408265,0.02709338,-0.087132014,0.006239294,0.0063114855,0.010827017,-0.026316145,0.011615494,-0.042545393,-0.043408807,-0.032278966,0.045218997,-0.0797621,-0.016605265,0.030577553,-0.0032207821,0.024906026,0.09303732,0.008616909,0.0011594264,0.05765857,0.036029857,-0.048586298,0.048847884,0.0116524855,0.013487672,-0.051742718,0.003312893,-0.0036406533,0.022316556,0.009243244,0.0007661797,0.09049543,0.014521012,-0.00033036302,-0.012906607,-0.025102083,-0.005497318,0.002861129,-0.023370776,-0.017357584,-0.056703843,0.06755896,-0.046412304,0.0026042138,0.0072172,-0.025593152,0.121418394,0.03457518,0.024038631,-0.053101126,-0.05995036,-0.044487465,0.037609123,-0.021014003,-0.00905324,0.012397343,0.023189072,0.027715059,0.02196971,0.02676295,0.025406865,-0.0039717187,0.015852084,-0.044252202,-0.02347454,-0.025453236,0.008413784,0.08176059,-0.00022135078,0.029096229,-0.033990655,0.014555088,0.005964876,0.00053152966,-0.008416132,0.017033568,-0.0130203925,0.010552509,0.07676075,0.081241585,0.041003417,-0.018741954,0.04768467,0.03437767,0.009508731,-0.008972799,-0.008831276,-0.013074914,0.031228084,-0.047084164,0.0021068791,0.06889678,0.000391254,-0.012769976,0.03671333,-0.023151739,0.06058244,-0.037955947,-0.00917625,0.0071042897,-0.03278936,-0.0024030867,0.0039174412,0.06417207,0.0016366867,0.0002156958,-0.025240116,-0.0012418426,-0.030526146,0.044549026,0.028344898,-0.04721497,0.0035657114,0.0036745274,0.029892886,0.004735669,-0.043896653,0.04002781,0.022383874,0.030472713,0.009663949,0.029998383,-0.023934621,-0.053458113,-0.02608819,0.022853708,-0.008373376,-0.037725452,0.009799627,0.035371255,-0.0051417844,0.016292984,-0.016683832,0.08276373,-0.0039655003,-0.020542838,0.025908954,0.004399792,0.021182511,-0.030550921,-0.020678036,0.09291311,0.008878284,-0.01759542,0.0020449457,0.021495529,-0.020176549,0.033881452,-0.0347343,0.06833491,0.007806206,-0.017591517,-0.069417275,0.028450044,-0.04633316,0.0012796572,-0.03176936,-0.01818985,0.025400816,-0.060136233,-0.063555084,-0.019571029,0.039474085,0.004021812,-0.05937558,0.06674782,0.02206151,0.030277204,-0.025601098,-0.027544267,-0.020979624,-0.04675861,-0.024239708,0.037691344,-0.024645464,-0.018796071,-0.06764521,0.03595896,-0.017837377,-0.008195494,-0.014974723,0.028952029,-0.008292828,-0.01508164,-0.013112545,-0.035838176,-0.013806115,-0.009672022,-0.01765366,0.08409704,0.062062073,-0.031743463,-0.021489728,0.01568411,0.014092323,-0.032393776,0.06709487,0.011776873,-0.031968325,-0.052227933,-0.021445049,0.037155278,0.01661405,-0.01745661,0.0017291874,-0.013109952,-0.030913493,-0.027250968,0.00922047,0.013269413,-0.005509604,0.034459006,-0.033436324,0.00017753852,0.026384562,0.030946704,-0.007743059,0.0013650683,-0.012094969,-0.011892745,0.008280539,0.0073826243,-0.04117039,0.027627781,-0.034831867,0.031370763,0.01437854,0.010755845,-0.07690238,-0.0039678346,0.0053005456,0.04275543,0.0551902,0.05053894,0.009788752,0.018714866,0.009689165,0.0283949,-0.045616772,-0.010976622,0.03515163,-0.043065786,-0.0057554767,-0.03299014,0.016826706,0.065620504,0.023228884,-0.047312878,-0.030584093,0.017961334,-0.02784131,0.025827428,0.054181553,0.031100852,0.014230678,-0.0065843007,-0.03718569,-0.00751269,0.004304496,-0.023709895,0.0351874,0.015801815,-0.03977529,-0.022863302,0.043659538,-0.008431696,0.031027682,0.03125122,-0.054686595,0.05919504,0.048508387,0.019423543,-0.0019469368,-0.04054313,-0.08540887,-0.0345087,0.052310225,0.01925807,0.0060254764,0.04380494,0.037599117,-0.0047038933,-0.03181029,0.011033684,-0.022375504,-0.010143936,-0.04773994,0.021939134,-0.010509578,0.0050955177,-0.010208609,0.049516313,-0.028103687,-0.04206392,-0.039519757,0.005715342,0.031188477,-0.010684404,-0.048028085,-0.00922848,-0.0017051271,0.078195184,-0.07287297,-0.017191313,-0.004301091,0.011540048,0.025803097,0.0060451296,0.077854246,0.018429417,0.039123163,-0.044339307,0.056164403,0.08366538,0.019913092]	2025-11-30 15:13:22.092+00
427f5738-c40b-4e9c-afbd-994334cce53a	¿Qué servicios ofrecen?	Ofrecemos: Odontología general, Estética dental, Ortodoncia, Implantes dentales, Cirugía Bucal, Endodoncia, Periodoncia, Odontopediatría, Prótesis Dental y Diagnóstico de Patologías.	{}	general	10	f	2025-11-30 01:22:57.862907+00	2025-11-30 16:37:50.819568+00	[-0.016066628,-0.011616544,-0.010642446,-0.034125187,-0.014048058,0.0106153125,0.015359607,-0.0054965084,0.017221134,0.04727353,0.038947728,0.013255743,-0.005279632,0.030660477,-0.0013668075,-0.031842876,0.002950089,-0.022833569,-0.1375076,-0.035304897,0.030465238,-0.036358614,-0.031236114,-0.015096362,-0.027130848,-0.0020051473,-0.0013538272,-0.012176109,0.026914082,-0.02154817,0.027224084,0.032973748,0.035056397,0.0076153087,0.027080333,0.006485935,0.00071027596,-0.039907005,0.014147841,0.013091123,0.011334122,-0.016534138,0.002672152,-0.102801345,-0.045512058,-0.027620913,0.008653019,0.076026455,-0.022829667,0.006074653,0.0123467175,-0.029504996,-0.02852942,0.060135685,-0.07507438,0.017353784,-0.0052316855,-0.0330187,0.017413188,0.035013117,0.0072086067,-0.028025556,-0.009376774,-0.022961132,0.018768879,0.042152297,-0.015764693,-0.056333516,-0.035046186,-0.030788446,0.0042330557,0.03396412,-0.0134919165,0.031880155,-0.03215774,0.0042438023,0.012291425,0.010817896,0.052472834,-0.01770513,-0.04538494,-0.014018318,-0.006394916,0.024583612,0.0068189157,0.0006583621,-0.028500544,-0.10214981,-0.011742405,0.022883827,0.08828402,0.071782276,0.009677928,0.0038346802,-0.0037498556,0.037074495,-0.029530836,-0.058894992,0.009653852,-0.00066963385,0.031864244,-0.010215524,-0.030327946,-0.03713824,-0.0017873293,0.025336482,0.031259358,0.0165919,-0.040871397,-0.015254082,0.015953034,-0.02499388,0.057404004,0.037112642,-0.07289767,0.02592695,-0.05296697,0.013176364,-0.019945547,0.005906318,0.0011583559,0.048673913,-0.027553705,0.065070406,0.036903575,0.010962388,0.009204339,-0.019428194,0.012673066,-0.029701022,0.02226548,-0.061433487,0.031314846,-0.0011646025,-0.036407877,-0.030803993,0.07794842,-0.007989004,-0.013760017,0.010383855,-0.025819475,-0.054319125,-0.06062577,0.015453204,0.030636195,-0.09940658,0.05626615,0.067153595,-0.01879084,0.0014904158,0.017158018,-0.039842565,0.0313288,0.003708059,0.062416445,-0.029129341,0.04752019,-0.06321311,-0.0040417514,0.032093633,0.054330047,-0.051284436,-0.018447518,0.025784971,-0.01798499,-0.008969664,0.025015173,-0.0036899133,0.027753988,0.008365102,-0.050853007,-0.034073353,0.06517099,-0.027880732,-0.023207994,0.01577918,-0.047455303,-0.009552759,0.043825716,0.03939255,0.10042409,0.04142539,0.030525206,-0.06520441,-0.041727148,-0.053164143,0.041025303,0.0113922,0.06188506,0.020558769,0.0011108562,-0.048806928,0.03142768,0.0299195,-0.0026751803,0.045359224,-0.022789206,-0.010926019,0.024903819,-0.025546677,0.026957942,-0.010386221,-0.009981818,-0.011503665,0.018028256,0.05894428,-0.017841103,-0.023100117,-0.04645117,-0.0347353,0.027572962,-0.022816502,-0.10016789,-0.022459988,0.032887593,-0.018843183,0.05114151,-0.018094592,0.015590992,-0.03397552,-0.027019871,-0.011795191,0.027484035,0.0070416173,0.04953399,0.021940887,-0.031118263,0.009608283,0.012358417,-0.034759786,-0.041447952,0.013403592,-0.0184953,0.03304157,0.025586925,0.059544988,0.012042532,-0.027856575,-0.0015505046,-0.075904034,0.0015082295,0.0014665731,0.11329276,-0.023522275,0.014539806,0.045429032,0.013117215,0.061065797,-0.031952314,0.004040524,-0.046027396,-0.012438769,-0.018873407,-0.049889684,-0.018520094,0.050028373,-0.015920427,-0.012882571,0.04408293,0.05010394,-0.0016358212,-0.08687387,-0.0065926723,0.0029188755,-0.061779805,-0.03030966,-0.010210517,0.04569978,0.021291861,-0.010278065,0.00750624,0.0009842709,0.024693782,-0.018314095,-0.009082545,0.004505294,0.011248375,0.023709582,-0.027624004,-0.035403315,0.036843535,-0.003702207,-0.005913047,0.027193878,0.0059523117,-0.005707945,0.01787657,-0.04073201,0.025166705,-0.0035247717,0.020989066,0.007802469,-0.08602187,-0.035424888,0.060089625,0.016089931,0.03188369,-0.016783074,0.010412543,-0.017291656,0.012048374,0.012007561,-0.007062816,0.04122553,0.014939635,-0.0457116,0.016164053,-0.055783827,-0.025873607,0.069902904,-0.03358598,0.015424956,-0.011578235,-0.0076586986,0.00054358225,0.055275843,-0.07400447,0.009173583,0.0074519683,0.06884281,-0.018816398,0.027186232,-0.038978815,-0.029254379,0.008849718,-0.0299237,0.006045217,-0.010694811,0.033869173,0.024073772,0.01625699,0.0011827346,-0.02789007,0.0068994807,-0.004510615,0.010038612,-0.035712823,0.0018835588,0.025755327,0.036561333,-0.013749089,0.0067780376,-0.03675381,0.0069398857,-0.010234682,-0.035967067,-0.07450154,0.014827383,0.01809297,-0.016253905,0.016173653,0.040553417,-0.04662535,-0.01168876,0.0017216721,0.010313883,-0.03769372,0.024971522,0.042916086,0.046797495,-0.002017316,-0.012201774,0.03239733,0.023982296,0.013849003,0.013194273,0.022969665,0.054402046,0.0060091764,-0.024236534,-0.026583117,-0.020895254,-0.010592003,-0.03344511,0.031620998,0.05236215,-0.029429862,0.0031295263,-0.026902854,0.010182184,-0.014240462,-0.011171987,0.009765984,0.020289578,0.009887757,0.054323427,-0.019732146,0.012143706,0.010043033,0.0058128065,-0.031368453,-0.006913115,0.017999455,0.009693206,0.055584606,-0.028716639,0.033534117,-0.022363659,-0.012658095,0.0012426501,-0.038952414,-0.019684816,-0.007918105,-0.013266315,-0.013198394,-0.0597287,-0.0047027455,-0.012845598,0.02714161,0.030260412,-0.02259454,-0.053797245,-0.023938052,0.034388963,-0.02284614,-0.0108632,-0.018906912,0.004935296,0.043111406,0.026774341,0.00358353,0.08144127,-0.00027421734,-0.024294106,-0.005812182,-0.09724753,0.01211065,0.023194645,-0.001117469,-0.056122262,0.058567833,0.03891667,-0.033345412,0.029980876,-0.0012204829,0.015748275,0.023547499,-0.07759941,-0.01648398,0.08349372,-0.026511278,0.015157062,0.12014106,-0.010643686,-0.022649243,0.03277657,0.024197914,0.017279396,-0.026598532,-0.047330923,0.00264145,-0.014768088,-0.020945756,0.03432802,-0.10671289,0.034158546,0.0045197387,0.01702759,-0.015260469,0.015887715,-0.03689629,-0.02408858,-0.030653391,0.004664682,-0.062317107,-0.026617598,0.06952419,-0.0013244392,0.009995118,0.058016248,0.04280643,0.007003105,0.11012413,0.0316973,-0.032448515,-0.035956588,0.011918636,0.008395847,-0.010619966,0.024877558,-0.001495053,0.04424096,-0.011738235,0.011532056,0.10620073,-0.0070425486,0.015418917,-0.06470499,0.0038385107,-0.0137459105,-0.002473607,-0.0009265145,-0.01663056,-0.05751452,0.048544634,-0.012339958,0.04049885,-0.012821709,0.015638204,0.112042174,0.037667092,0.0073252353,0.029603928,-0.10024414,0.00784013,0.024524521,-0.04197247,-0.01662357,0.046687514,0.04305165,0.0053491504,0.03436582,-0.005472704,0.06257324,0.013490084,0.00060901535,-0.017743928,0.03803296,-0.023576189,0.029034866,0.014640152,-0.061674286,0.0079925945,-0.027314704,-0.018927261,0.02153963,-0.008068653,-0.010535415,0.024254413,0.038262825,0.0033784714,0.07768492,0.08507202,0.015457503,-0.01200589,0.02942985,0.04484824,0.02844468,-0.019740133,-0.045961354,0.0026369444,0.009313205,-0.064712696,0.024966937,0.00830326,-0.0012989034,-0.038570948,0.036442295,-0.04157047,0.047313802,0.06368457,-0.09081655,-0.0065201875,-0.0057246783,-0.020341843,0.0011201288,0.039260477,-0.012227828,-0.024664,-0.023590235,0.03240957,-0.0050095874,0.072983295,-0.045912188,-0.007229981,-0.01530194,0.020960443,0.02947942,-0.0030226212,-0.043852683,0.02838679,0.0427168,0.05563186,0.017782953,0.060265027,-0.033982903,-0.05530804,0.020756984,9.381109e-05,-0.002286915,-0.038485028,0.01694376,0.027964039,0.028622432,-0.009108743,0.047896337,0.014819288,-0.037455216,-0.04359226,0.030468145,-0.004678466,0.0271147,-0.02972946,-0.0515863,0.019900514,-0.041236103,-0.056555767,-0.03518343,0.022984425,-0.032377478,-0.01045516,-0.013761549,0.03202486,0.007461544,-0.03415894,-0.05573204,0.041519176,-0.077646464,-0.022769395,-0.019194856,0.012989953,0.047950074,-0.039206598,-0.061589424,0.0050147506,-0.041738603,-0.0042352914,-0.0721538,0.025967121,0.0065345536,0.035875287,-0.032604687,0.015306175,-0.03547252,-0.06338896,-0.025009155,0.039370425,0.05229158,0.024905678,-0.050446115,0.038901553,0.020874001,0.026567739,-0.016239332,-0.013983254,0.003395496,0.025034718,0.0071429247,0.03464342,-0.053417854,-0.039764535,0.056739304,0.10929942,0.02090613,-0.03506245,0.027216978,0.024913259,0.017370373,-0.004904195,0.06734553,0.03141619,-0.012522126,-0.04372645,-0.0030923826,-0.03175351,0.026297549,0.012343144,-0.01484975,-0.007173616,-0.029025896,-0.05974904,0.033440266,0.027228948,-0.031880118,-0.017482521,-0.045636214,-0.04022221,0.03834873,0.03932975,-0.033597995,-0.008942415,-0.0020953766,-0.010343755,0.032613255,0.052494187,-0.060461313,0.0014133989,0.013073355,0.033531416,0.010385408,-0.013732989,-0.03393993,0.0023381277,-0.020778771,-0.030020649,0.08390667,0.036579806,0.059076432,-0.011140256,-0.00701796,-0.0031011538,-0.041487217,-0.046638682,0.0027539493,-0.056633253,0.05992011,-0.03918773,0.03785082,0.008250532,0.00060022116,-0.06275154,-0.019011611,-0.021688594,0.0049019055,-0.015936883,0.03265838,0.04215614,0.024003109,-0.004365831,-0.017674709,-0.026706673,-0.030319314,-0.043474216,0.035698522,-0.005044699,-0.024211409,0.013968462,0.068717964,-0.045968533,-0.0076425085,0.04294245,0.013062657,0.050066873,0.018069256,0.035211343,0.002012576,-0.05309453,-0.080245204,-0.07247092,0.05370428,-0.0082616955,0.003983278,0.026629627,-0.012179187,-0.009470041,-0.0059838006,-0.002956152,-0.012009169,-0.052792758,0.009367133,0.024194581,-0.032448903,-0.0031234697,-0.027368488,0.025619064,-0.018687194,-0.0049855015,-0.020613678,-0.026277227,-0.001184939,-0.01570628,0.0416108,0.01058633,-0.015516424,0.06127852,-0.051948216,-0.01847911,0.033869218,0.003473765,0.032246836,0.010788271,0.12598968,0.028193366,0.050502516,-0.007712218,0.01765231,0.05546501,0.026991552]	2025-11-30 16:37:50.568+00
9d4e71be-4bf0-42d2-ae9f-14c05081e950	¿Cuál es el horario de atención?	Nuestro horario de atención es de lunes a viernes de 9:00 AM a 7:00 PM, y sábados de 9:00 AM a 1:00 PM. Los domingos permanecemos cerrados.	{horario,atención,hora,abierto,cerrado}	horarios	10	f	2025-11-27 07:01:47.699609+00	2025-11-30 16:38:01.101573+00	[0.01594411,0.04278895,0.008297229,-0.042119876,-0.0056922785,0.036154125,0.026721062,-0.06180939,0.03606231,0.031778835,-0.003700034,0.053262167,0.07544213,-0.00027483553,-0.08561157,0.0075311023,-0.0021206415,-0.0453638,-0.110646896,-0.037751317,-0.001357877,-0.012876864,-0.023474699,-0.025882434,-0.01466358,-0.0012510617,0.034079593,-0.07264205,-0.019474704,-0.053191714,0.010648036,0.0039631054,0.0015777504,-0.020404227,0.055401396,0.012058029,0.013639576,-0.0148130115,0.017215757,-0.041842453,-0.036436927,0.01139169,0.015064353,-0.0653397,-0.02812573,0.024493461,-0.047770277,0.053075008,-0.010283177,0.038122002,0.04215151,-0.014768689,-0.01475985,-0.0049646515,-0.061114457,0.019003145,-0.018789306,-0.05326737,0.037058584,0.028235495,-0.009401953,0.043205958,0.009676754,-0.011998194,-0.0012527293,-0.034527782,0.05234017,-0.030752411,0.02200593,-0.040297758,0.008741717,0.037533347,-0.047022138,-0.021460813,-0.055952623,-0.0067946874,0.02822802,0.04654398,0.07930744,0.045665078,-0.051118456,-0.005556063,0.0014326021,0.0029732538,0.04844493,-0.053709466,0.038635388,-0.0929843,-0.06266897,0.04295585,0.112559795,0.020958891,0.001724026,0.0069906125,-0.011277836,-0.01331021,-0.020350877,-0.058944967,0.043162126,-0.004209556,0.008795013,0.034366835,0.012968255,-0.041271366,0.019918699,-0.021557974,-0.051487908,-0.0048122215,-0.06220465,0.05083368,-0.014671892,-0.014099682,0.09427282,0.032838978,-0.028661933,0.003832736,-0.027219063,0.024526205,0.0024798908,-0.004728822,0.031580225,0.032611456,-0.041298013,0.074635126,0.03066098,0.03376672,-0.03309616,0.00521338,-0.030202935,-0.026509067,-0.02635528,-0.05229636,-0.013893401,0.00031898633,-0.0474911,-0.026065184,0.08430679,-0.038813017,0.0103952,0.025112215,-0.053042598,-0.07235984,-0.023949258,-0.019908274,-0.008541025,-0.07934163,0.010292426,0.102873474,-0.021274114,0.022479385,0.0030005379,0.017046997,0.0440712,-0.031873643,0.0142285535,-0.0107333865,0.00034462268,-0.03610643,0.019574178,0.010683804,0.055369087,-0.04756857,-0.029201953,0.059730843,0.004755133,0.03302063,-0.019654013,-0.00925313,0.012850131,0.0029832772,0.0067136227,-0.058327533,0.0673966,-0.09766733,-0.035431746,0.041376263,-0.029768169,-0.017177762,-0.0062425216,0.05650433,0.10218017,0.012200359,0.024836533,-0.041436728,-0.019572683,0.015631903,0.050153393,-0.0051561645,0.08732005,0.01924154,0.018475244,-0.0649666,0.0261987,0.042218972,-0.03728194,0.0833971,-0.019555666,0.013224655,0.018569632,-0.03088831,0.063393906,0.07110453,-0.035316136,-0.019184222,-0.03508004,0.023942847,-0.015382715,-0.018978743,-0.030359108,0.006097095,0.009907142,-0.009442213,-0.037345637,0.0016201821,-0.01128999,-0.040704764,0.06680732,0.039965518,-0.023437656,-0.0565387,0.01641427,-0.05334674,0.024725532,0.007556499,0.023119511,0.010382637,-0.029718108,-0.008630204,-0.034464646,-0.020399995,-0.056787282,-0.031413108,-0.046489142,0.011701974,0.044240974,0.05818099,0.02527065,-0.0496695,0.021720357,-0.07582856,-0.004362893,0.022965254,0.059081446,0.0209823,-0.0008818761,-0.008309871,0.04511603,-0.0005231192,-0.062188476,-0.014224901,-0.005279589,0.0161205,0.024656435,-0.006274296,-0.04966718,0.0030239252,0.020784061,0.016561482,0.01651524,0.04256852,0.025484689,-0.03659307,-0.007794772,-0.0016141109,-0.068087205,-0.06575719,-0.047096666,-0.0044092718,0.01612656,0.013157906,-0.017826296,0.010150426,-0.04622508,0.0068137404,-0.08278293,-0.0075098365,-0.05927269,0.027337037,-0.015746837,-0.0055670054,0.04733127,0.0070211743,0.024293354,0.04582924,0.0053151427,-0.01730027,0.015098631,-0.02979601,0.0203391,0.002021042,0.015084989,0.04425551,-0.04978297,-0.03489346,0.030517962,0.030501558,0.03982836,0.018081572,0.03812597,0.040786304,0.03168845,0.058510464,-0.039002478,0.035835702,-0.006087772,0.01735597,0.038961403,0.010018638,-0.015452676,0.022346783,-0.00840392,0.07008918,0.0014011158,0.015747316,-0.041094735,0.0415113,-0.09158976,-0.007685494,0.012778591,-0.005488462,0.00025376352,-0.009740682,-0.014766663,-0.01052028,0.012416494,-0.03773333,-0.0044876435,-0.021382276,0.015054559,-0.018875014,0.0052033393,0.02949849,0.03829457,-0.026067518,-0.021535907,0.03166017,-0.054619975,-0.047349893,0.09144811,0.018818667,-0.0035062635,0.05666906,-0.006818398,0.021705035,-0.002078494,-0.025644975,-0.018750278,0.025311982,0.013408957,-0.03914825,-0.009546032,0.030604014,-0.08044657,-0.010682065,0.04648907,-0.0029518257,-0.0035638304,0.015148115,0.0084065115,-0.008853836,0.019902114,0.07400556,-0.008576945,0.03177691,-0.02108244,-0.014169974,0.05157843,0.021411689,-0.03074468,-0.0071602087,-0.010968589,0.013912752,0.02470528,-0.0422981,0.006345829,-0.011580733,-0.05424925,0.055199184,-0.004137328,-0.019193104,-0.053189717,-0.0420959,-0.010253356,0.0033152578,0.034673292,0.04305288,-0.08044626,0.018973287,0.045437977,-0.003005268,-0.022693144,0.033907473,0.041360877,0.011635767,0.118370496,0.004452673,0.006674742,-0.018887369,-0.012643228,-0.0009235231,-0.013591408,0.00035450404,0.04159497,-0.012956585,-0.013053402,0.034025375,0.009802612,0.047044285,0.03918688,-0.033565268,0.01564459,0.029060956,0.032867793,0.0071956622,-0.05621623,-0.019755436,0.015408234,0.02358519,0.03416331,0.02924223,0.044583328,0.042182792,0.06531351,0.034439012,-0.019525418,-0.09813048,0.009165482,-0.0298338,-0.00011938074,-0.05041864,0.017842421,0.05393007,-0.032475673,0.025811061,0.052122585,0.026565077,0.027823135,-0.05635259,-0.0051531997,0.061508484,-0.036890075,0.008356648,0.0702372,0.009404212,0.017295806,0.066257365,0.020360198,0.029129773,-0.020105276,-0.05083112,-0.00906735,-0.032645628,-0.018811926,-0.012457434,-0.090983324,0.05134834,-0.006866308,0.03816098,-0.034803156,0.037658863,-0.021747597,-0.01845447,0.0025940335,-0.009773113,-0.03986023,-0.07051067,0.0049429047,0.015366047,0.023572242,0.0058450033,0.041509274,-0.018653532,0.061369717,0.018895116,-0.026573144,-0.06313774,-0.013394905,0.00442035,-0.03811467,0.011712748,-0.009306927,-0.003319241,-0.012720187,0.014263682,0.064392336,0.0064364974,0.051343434,-0.011294004,-0.0260283,0.014422866,0.037474558,0.015143674,0.03368039,-0.03474704,0.058905374,0.035128664,0.076242805,-0.018770963,0.00083126617,0.10605971,0.08742623,0.02435081,0.017444775,-0.02753483,0.010829137,0.055800892,-0.014502044,-0.0492463,0.06146638,0.033283625,0.022746773,0.026993174,-0.0011256193,0.008307836,0.0113712745,0.04256577,-0.0076982128,-0.011986628,0.025143722,0.04933504,0.020063277,-0.03929254,0.03180068,0.005904518,0.014385288,-0.004533567,-0.021307504,-0.02849098,0.005812833,0.013826702,0.029856667,0.08768107,0.05961464,0.024760302,0.007963269,0.060316272,0.029101003,0.0756981,-0.0025911997,-0.004240547,-0.014719094,0.003451727,-0.05235674,0.04185523,0.058496933,0.012034549,0.016887825,0.0021575587,0.005365082,0.074557394,-0.015820384,-0.061690588,-0.02791026,-0.028012356,-0.0055159885,-0.017849175,0.033805866,-0.010851785,0.016698169,0.023848554,-0.02148814,-0.028192792,0.054631613,0.008930196,0.00781001,-0.015675122,0.03806839,0.028247656,-0.024881136,-0.027838124,0.070609875,0.033427533,0.035970233,0.0045312042,-0.011163018,-0.006765599,-0.04854137,-0.061189834,0.008967192,0.0032290164,-0.03192457,0.016733883,0.00077933137,0.0022717053,0.04540013,-0.0401815,0.0051605916,-0.015493747,0.01593474,0.050080925,0.009983265,0.015049695,-0.047380343,-0.06297831,-0.0068292115,-0.010681198,-0.0062753293,-0.009576801,0.014924045,-0.014063654,0.014320163,-0.042751443,0.05133273,-0.026361138,-0.02636921,-0.0395808,-0.030774217,-0.029778061,0.017213149,-0.018075867,-0.012176356,0.040516328,-0.022667643,-0.043360062,0.03496309,-0.005256941,-0.01882157,-0.037662573,0.021769451,-0.006885104,0.037078902,0.0032956114,-0.024524948,-0.032919887,-0.015657524,-0.017546281,-8.9178735e-05,0.038393036,-0.03266587,-0.018873444,0.030343747,-0.010590904,0.0509521,-0.047779948,0.027542906,0.00045140323,0.017319897,0.010765527,0.038532905,-0.046479672,-0.0076949624,0.044958036,0.02571867,0.0018706712,-0.059012286,-0.00075589446,0.02608467,-0.032647192,0.030034482,0.021832256,-0.0042412337,0.033209752,-0.040291023,-0.010421444,0.008244119,-0.046701405,-0.008403151,0.025024403,0.007793775,-0.007211985,-0.04636602,-0.013271801,0.0027551644,-0.009917509,-0.02647027,-0.056719296,-0.055319592,-0.009390606,0.009069041,-0.045088142,-0.016580239,-0.032967143,0.022652796,0.035985045,0.026463058,-0.03430433,-0.019044293,0.03868701,0.027919874,0.012377904,-0.032025035,-0.0046396996,0.03471268,-0.03535203,-0.063008666,0.07842024,0.037799057,0.0069476343,0.0024430016,0.0073998854,0.02157515,-0.07955348,-0.027895762,0.026949441,-0.07985449,0.04556285,-0.01648459,0.027343705,0.018886652,0.061143506,-0.010425468,-0.020162666,-0.05902322,0.01027068,0.024778785,-0.010421532,0.062059253,0.010083525,0.024341587,-0.007719388,-0.02569567,0.010428006,0.023361506,0.011379928,-0.010972959,0.042576805,0.027552998,0.049331613,-0.024438562,-0.0006904218,0.037872165,0.010142821,0.022940587,0.00576176,0.06135834,0.0018621116,-0.04696798,-0.049536012,-0.036805652,0.04959118,0.019788487,-0.0059109074,0.027569707,0.009792783,-0.011951291,-0.0316479,0.017634304,-0.03591966,-0.051099647,-0.02890553,0.0031830631,-0.015539548,0.00757631,-0.02039204,-0.011041695,0.03633784,0.0020207558,0.0050046328,-0.04055429,0.018923078,-0.08433141,0.033488534,-0.0047197794,-0.01093113,0.05069095,-0.037762597,0.027256563,0.02400497,0.049099166,0.020272125,-0.017222462,0.06162271,-0.03611981,0.049013652,0.0050497814,0.017714633,0.04366026,0.04079848]	2025-11-30 16:38:00.874+00
aabd8b18-a057-49b8-bfb9-7c62ee9ad030	¿Cómo puedo agendar una cita?	Puedes agendar una cita llamando al +51 952 864 883, enviando un WhatsApp al mismo número, o visitándonos directamente en Av. General Suarez N° 312, Tacna.	{cita,agendar,reservar,turno,whatsapp}	citas	10	f	2025-11-27 07:01:47.699609+00	2025-11-30 16:39:52.868912+00	[0.0077968193,0.043522865,0.018531194,-0.052414283,0.04406526,0.021114074,-0.02941803,-0.00820703,0.03161325,0.0333665,0.013266141,0.050874695,0.0074699586,0.024533695,-0.072565325,0.0017071066,-0.03025803,0.042893477,-0.0961778,-0.025859958,0.026318934,0.0092196865,-0.0019721047,-0.019360019,0.015771553,0.025147852,0.032091893,-0.04482476,-0.0057380744,-0.02847122,0.041157085,0.067452505,-0.0027257027,-0.03791557,0.0407615,0.027559845,0.010962477,-0.0047834003,0.043468744,0.0014419438,-0.005397669,-0.03497831,0.002788966,-0.052426256,-0.049696658,-0.03970987,-0.06772953,0.04232786,-0.05884318,-0.0041281497,0.06548503,-0.0048104855,-0.0026147175,-0.0105585065,-0.06710349,-0.0042900755,-0.028653705,-0.061710685,0.050989464,-0.016210126,-0.04185158,0.044814896,-0.060456086,-0.0012143638,0.053430345,-0.027108299,-0.0070461286,-0.05396427,-0.009300962,-0.034747485,-0.04071627,0.022155698,-0.048752375,0.0021553345,-0.034673616,-0.017698782,-0.027203094,0.039272297,0.07715617,0.024789289,-0.054426275,-0.023480318,-0.021701666,0.05722437,0.0038418225,-0.05505596,0.010161892,-0.12042292,-0.049643043,0.009979572,0.11395612,-0.018000698,-0.007241585,-0.00042992827,0.016449902,0.0001798654,-0.02863861,-0.055316772,0.011130324,-0.0016758856,-0.004512264,0.036017835,-0.049863577,-0.0028668838,0.040927503,0.023654172,-0.034801684,-0.0012393219,-0.043130226,0.09177879,-0.0036412377,-0.053116877,0.04194025,0.015352417,-0.079717696,0.035242774,-0.065904826,-0.024176018,0.010124708,-0.011413397,0.03217269,0.032123953,-0.05783167,0.039505433,0.030692684,-0.0047151116,-0.0030070783,0.017626826,-0.051271144,-0.00017898118,0.022896407,-0.088583045,-0.008796854,0.020773247,-0.050911043,-0.043143786,0.064632155,-0.0388444,-0.021038726,0.0052464693,-0.029883767,-0.020805664,-0.06407034,0.040910736,0.016825035,-0.048944645,0.0036144936,0.047482986,-0.022124264,-0.0024842846,-0.0502529,0.025565948,0.044967897,-0.014421686,-0.015834685,-0.00014827501,0.034533832,-0.07057715,-0.0006131427,0.0030046485,0.049717095,-0.065146714,0.028615588,-0.015198876,-0.012704637,0.011738127,0.016370485,-0.028797919,0.03959555,0.055876397,-0.00411929,-0.03334115,0.09459667,-0.013791461,-0.035826106,0.045297112,-0.031274524,-0.036933396,0.02781786,0.049568184,0.097125545,0.041246567,0.008175549,-0.06584361,-0.015767256,-0.041424397,-0.005161873,0.010213656,0.052301604,0.02766613,-0.028727138,-0.04090169,0.01340157,0.027874026,-0.022365097,0.03299964,-0.006425363,0.020997966,0.042981107,-0.0406793,0.1058766,0.04772858,-0.030537233,-0.0043103024,-0.01767954,0.023959316,0.023118962,-0.033768423,-0.040187515,-0.007497342,0.021937339,-0.03233248,-0.03196761,-0.024383461,-0.02211117,-0.010858071,0.024992008,0.008052755,0.009302706,-0.049902562,-0.027796568,-0.03393869,0.047015086,0.031727143,-0.010833004,0.026580999,-0.08924113,-0.029139062,0.016477969,-0.04958825,-0.052169356,0.039835557,-0.0395238,0.03384054,-0.037078347,0.023203725,0.031582776,-0.064827934,-0.0020116314,-0.04545295,0.04253277,0.041341294,0.047053237,-0.024159795,0.030378027,0.075038835,0.01920458,0.034640584,-0.016357157,-0.0050418666,-0.023272483,0.01244959,-0.054816805,-0.002999865,-0.057712365,0.013800511,0.061341986,0.020248985,0.0011481782,0.036157623,0.034289144,-0.052615337,-0.011155157,0.0049742064,-0.07920705,-0.08900265,-0.019471763,0.015275793,0.0483778,0.032910857,-0.015171917,-0.044245873,-0.004196789,-0.018284217,-0.023171883,-0.008302338,-0.032537177,0.038713243,-0.05529577,0.0060479073,0.09446612,-0.03177541,-0.013126856,-0.0041921674,0.012745542,-0.014884253,0.023422489,-0.011193718,0.036139127,-0.00042287365,0.030123482,0.044280954,-0.018674614,-0.028482247,0.03219579,0.030742148,0.029555747,-0.00904028,0.043031596,0.0006152289,0.025918268,0.03833088,-0.037845798,0.040833566,-0.023935836,0.028626775,0.015130879,0.01176402,-0.004827937,0.026300456,-0.013556405,0.031179383,-0.023578899,-0.012719961,-0.04739551,0.03272406,-0.09011449,-0.009001142,0.021819511,-0.03267581,-0.033118226,-0.009562965,-0.023699163,-0.0052246465,-0.02382808,0.019092403,0.034298923,-0.017240532,0.012833839,-7.205279e-05,0.034434896,-0.012855517,0.006906509,-0.022978092,0.022487422,0.02640615,-0.05019976,-0.023255443,0.06374138,0.051129792,0.030890552,0.04541123,0.0057834093,0.027161906,0.006063185,-0.017879415,-0.080506675,0.01416192,0.008564012,0.011318714,-0.004976559,-0.0024313345,-0.055179127,-0.010470288,0.019670034,-0.027318131,0.00017406525,-0.0012051497,0.05416476,0.005786133,-0.038640007,0.067381755,-0.0022863748,0.032193214,-0.016433598,-0.020883428,0.041095108,0.07221782,0.0046669054,-0.010042793,0.0095624905,0.03100346,-0.026224926,-0.048580054,-0.0096102115,-0.009545891,-0.0038733792,0.018225046,-0.0168377,-0.027378438,-0.026712622,-0.027236586,0.014450812,0.0091946,-0.0023853474,0.0864928,-0.06781615,0.014566042,0.021532116,-0.02378792,-0.01640177,0.06964734,0.058728732,-0.005355149,0.05128501,0.021790197,0.014834485,0.0046561253,-0.012287896,0.0033562721,-0.07163132,-0.012290481,0.04430225,0.0071743196,-0.0019059821,-0.017958332,0.0148422,0.045745395,-0.0052318694,-0.012800615,0.025642985,-0.05533167,0.024893016,0.022049572,-0.033594113,0.010401793,-0.00719462,0.0033187019,0.020606607,-0.00862473,0.00979489,0.0369283,0.005631672,0.008783514,0.014598203,-0.11555855,-0.01243329,-0.037132766,0.0047791568,-0.029251719,0.091512986,0.003406167,-0.02027434,0.04754656,0.06999331,0.033587206,0.0028033855,-0.092918724,-0.040893346,0.032981385,-0.04373429,-0.00070927315,0.06807268,0.06700109,0.019090712,0.028244354,0.010419315,0.020479238,0.02139678,-0.044505324,0.021826234,-0.02002251,0.03120001,-0.018965103,-0.084124394,0.058723222,0.017890614,0.03151401,0.009430854,0.012797583,-0.057569843,-0.015437038,-0.022083469,-0.03424117,-0.018471275,-0.04398874,-0.012651054,-0.0056361905,-0.020164322,0.022736516,0.008854601,-0.0151853915,0.060380004,0.055803914,-0.05862223,-0.01721947,-0.0054841954,0.031650346,-0.056023907,0.000879231,-0.03028859,-0.014519338,-0.041724216,0.0318886,0.10506807,0.010880788,0.02603229,0.03428539,-0.042028274,-0.013989729,0.0012691937,0.030779071,0.01075949,-0.046457514,0.026232908,-0.03875309,0.054156028,0.012638414,-0.030654427,0.04550168,0.06710944,0.009162101,0.014365926,-0.042083982,0.0023493029,0.02196968,0.01024112,-0.023846876,0.028905805,0.028865362,-0.011178502,0.058566455,-0.0072530448,0.017146597,0.009614543,0.032950033,-0.021114523,-0.03378929,-0.009180021,0.03875911,0.04678122,-0.021513527,0.030149769,-0.011746043,-0.02172956,-0.0052824863,0.060291674,-0.027140632,0.018970855,-0.031042598,0.027756361,0.0973439,0.075142,0.018171228,0.008655049,0.021493848,0.019602265,0.05578439,0.005144289,1.5605538e-05,0.025467828,0.045172144,-0.028982408,0.01695023,0.0040111598,0.026187925,-0.02107764,0.007185846,-0.027022481,0.026606368,0.0077361637,-0.005667575,0.009066582,-0.050207585,0.0010298064,-0.03659137,0.03986437,-0.014189356,-0.016968595,-0.033095498,-0.0014138735,0.016182486,0.0372518,-0.026581807,-0.040178645,-0.02556443,0.0035398824,0.032953613,-0.017336896,-0.028523296,0.044070903,0.0035404062,0.013701024,-0.001573367,-0.012601349,-0.0064891134,-0.102561526,-0.036136348,0.040325057,0.018753743,-0.042839658,-0.0034739918,0.044606723,0.020016218,0.04871752,-0.03460077,0.0347721,-0.029562578,-0.018207638,0.0146320015,0.010711021,0.0606025,-0.023080792,-0.04756998,0.019898018,0.030707773,-0.031925462,0.0017609472,-0.024103466,-0.020241294,0.02115414,0.0058422918,0.049146514,0.0020547109,-0.0037213436,-0.06855294,0.00028611795,-0.018899111,0.026343243,-0.013113165,0.013277294,0.014266949,0.024780964,-0.089539826,-0.003268812,-0.014215403,-0.0044215387,-0.050696827,0.022181572,-0.038391463,0.036004994,0.029319802,-0.024404904,-0.025186883,-0.021977933,0.0045789406,-0.027011365,0.033711005,-0.013395989,-0.02601178,-0.016135745,0.011565476,-0.0021077108,-0.0483677,-0.0029991756,-0.042519975,-0.015234481,0.0023814894,0.027758693,-0.037770458,0.0051695635,0.002758746,0.1165456,0.050373126,-0.038125042,-0.03083344,-0.01234873,-0.010328584,0.02058549,0.033353906,-0.025940405,0.039057743,-0.010275856,-0.017745681,0.020292617,-0.056722037,-0.0070747444,-0.007867188,-0.007351393,0.0002814491,-0.03395289,0.036560006,-0.0062264106,-0.042192195,-0.039397,-0.019989055,-0.049050074,0.017003393,-0.0035402349,-0.037026063,0.019149577,0.016048593,-0.011560606,0.012881849,0.01834678,-0.00714333,0.022786377,0.07399834,-0.051616248,0.0260045,-0.041827343,-0.02706628,0.038253076,-0.02672218,0.014676465,0.06222473,-0.0026960026,0.015039326,-0.032763876,0.031516843,0.035283048,-0.04875881,-0.03158986,0.033923987,-0.049981594,0.046290196,0.0026423198,-0.019550176,0.017849961,0.070986904,0.0021615226,0.007196753,-0.021575585,-0.0033762562,0.029266467,0.012663231,0.032601204,0.034646083,-0.0030094534,-0.027201938,0.001308738,0.026331982,-0.001405229,0.019020157,0.030013127,0.026627075,0.0045924094,0.06415241,-0.022849755,0.02520364,0.063468955,-0.03303278,0.0060898676,0.052000117,0.021680925,-0.011712137,-0.054869253,-0.047580056,-0.051667143,0.09035788,0.032485526,-0.014571522,0.02366966,0.03614127,-0.018990139,0.012955978,0.010726118,-0.018674944,-0.033542607,-0.0359529,-0.009213664,-0.046935823,-0.019025305,-0.04998058,-0.011824108,0.024068732,0.0075141727,0.01231515,-0.027015187,0.042279437,-0.033806123,0.02524601,-0.01945146,-0.020885687,0.070779994,-0.03450962,-0.009581676,-0.044301063,0.03618837,0.06706559,0.006955082,0.048832323,0.031643376,0.06678846,0.00078462675,0.009196877,0.042460352,0.03676741]	2025-11-30 16:39:52.626+00
\.


--
-- Data for Name: chatbot_rate_limit; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."chatbot_rate_limit" ("id", "ip_hash", "requests_count", "first_request_at", "last_request_at", "blocked_until") FROM stdin;
\.


--
-- Data for Name: cie10_catalogo; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."cie10_catalogo" ("id", "codigo", "descripcion") FROM stdin;
1	K00.0	Anodoncia
2	K00.1	Dientes supernumerarios
3	K00.2	Anomalías del tamaño y forma del diente
4	K00.3	Manchas del desarrollo del diente
5	K00.4	Alteraciones de la erupción dentaria
6	K00.5	Alteraciones de la posición dentaria
7	K01.0	Dientes retenidos
8	K02.0	Caries limitada al esmalte
9	K02.1	Caries de dentina
10	K02.2	Caries del cemento
11	K02.3	Caries detenida
12	K02.9	Caries dental sin especificar
13	K03.0	Atrición excesiva de los dientes
14	K03.1	Abrasión dental
15	K03.2	Erosión dental
16	K03.3	Reabsorción patológica del diente
17	K03.4	Hipercementosis
18	K04.0	Pulpitis
19	K04.1	Necrosis de la pulpa dental
20	K04.2	Degeneración de la pulpa dental
21	K04.3	Formación anormal de tejido duro en la pulpa
22	K04.4	Periodontitis apical aguda de origen pulpar
23	K04.5	Periodontitis apical crónica
24	K04.6	Absceso periapical con fístula
25	K04.7	Absceso periapical sin fístula
26	K05.0	Gingivitis aguda
27	K05.1	Gingivitis crónica
28	K05.2	Periodontitis aguda
29	K05.3	Periodontitis crónica
30	K05.4	Periodontosis
31	K05.5	Otras enfermedades periodontales especificadas
32	K06.0	Retracción gingival
33	K06.1	Hiperplasia gingival
34	K07.0	Anomalías importantes de la relación maxilofacial
35	K07.1	Anomalías de la relación entre arcos dentarios
36	K07.2	Anomalías de la posición dentaria
37	K08.0	Exfoliación dentaria debido a causas locales
38	K08.1	Pérdida dentaria debida a accidente, extracción o enfermedad periodontal local
39	K08.2	Atrofia del reborde alveolar posterior a la extracción
40	K08.3	Retención de restos radiculares
41	K08.4	Desgaste dental excesivo
42	K09.0	Quistes del desarrollo de las regiones bucales
43	K09.1	Quistes dentígeros
44	K09.2	Quistes de erupción
45	K10.0	Trastornos del desarrollo de los maxilares
46	K10.1	Granuloma central de células gigantes
47	K11.0	Trastornos de las glándulas salivales
48	K12.0	Estomatitis aftosa recurrente
49	K12.1	Otras formas de estomatitis
50	K13.0	Leucoplasia oral
51	K13.1	Otras lesiones de la mucosa oral
52	K14.0	Glositis
53	K14.1	Lengua geográfica
54	K14.2	Lengua fisurada
\.


--
-- Data for Name: citas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."citas" ("id", "paciente_id", "odontologo_id", "fecha_inicio", "fecha_fin", "estado", "motivo", "costo_total", "moneda_id", "google_calendar_event_id", "notas", "created_at", "nombre_cita", "caso_id") FROM stdin;
1cb9eb1a-a77a-4487-bf7e-1d98c6ed779a	17977759-62ad-4793-8b9e-9dc2b3652cd8	141b2519-daf3-4bf8-8dac-e97840181403	2025-11-24 17:00:00+00	2025-11-24 17:01:00+00	Programada	Limpieza Bucal	125.00	d91d86da-e1c6-4510-adf2-71f10303e9fe	\N	Pago por Yape	2025-11-23 19:02:52.005391+00	Limpieza Bucal	\N
acca2db5-f5eb-4b83-a876-dffe71857f9a	17977759-62ad-4793-8b9e-9dc2b3652cd8	f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8	2025-11-23 17:00:00+00	2025-11-23 18:00:00+00	Programada	Control de braquets	123.00	d91d86da-e1c6-4510-adf2-71f10303e9fe	\N	El pago sera por Yape	2025-11-23 19:11:03.713564+00	Control de braquets	\N
2d34d055-07b8-4188-afbb-45abb98064c0	bef88313-ecbe-4c78-b0d8-2dd7083afc8e	6c806f28-8135-4406-8a4e-e7a8c5fdadec	2025-11-25 17:00:00+00	2025-11-25 18:00:00+00	Programada	ETC	1.00	d91d86da-e1c6-4510-adf2-71f10303e9fe	\N		2025-11-23 19:22:55.190491+00	ETC	\N
5803d57b-36bf-4c16-8a33-8ea4a36701ed	bef88313-ecbe-4c78-b0d8-2dd7083afc8e	31ec8fab-61ed-4394-b3d0-4595526208b7	2025-11-25 17:00:00+00	2025-11-25 18:00:00+00	Programada	asas	1.00	d91d86da-e1c6-4510-adf2-71f10303e9fe	\N		2025-11-23 19:29:33.190742+00	asas	\N
845dfd48-5617-42cd-b80a-c7764c34560d	17977759-62ad-4793-8b9e-9dc2b3652cd8	6c806f28-8135-4406-8a4e-e7a8c5fdadec	2025-11-24 17:00:00+00	2025-11-24 18:00:00+00	Programada		12.00	d91d86da-e1c6-4510-adf2-71f10303e9fe	\N		2025-11-24 17:56:46.208219+00	Consulta odontológica	\N
fe84e13f-2b12-48b6-9dce-df93d4bd0468	0493cea8-0c9c-4f9c-bb4a-cea37b2112d6	472e0026-4625-4b47-90f9-5319ffad53bd	2025-11-26 18:30:00+00	2025-11-26 19:30:00+00	Confirmada	control	150.00	d91d86da-e1c6-4510-adf2-71f10303e9fe	\N	la wa de la wa	2025-11-24 17:57:55.176136+00	control	\N
31f6e2e0-d8fb-4c6f-8036-e96c61b8ad4b	6be7bfe6-1450-4a43-8027-5f4d258dedca	141b2519-daf3-4bf8-8dac-e97840181403	2025-11-28 17:00:00+00	2025-11-28 18:00:00+00	Programada	xd	1.00	d91d86da-e1c6-4510-adf2-71f10303e9fe	\N	test	2025-11-27 16:05:03.293869+00	xd	\N
7090261e-77ac-463b-9ca4-e27f90e6e193	4d24b29f-0155-461d-83d2-db32c4b74cbd	31ec8fab-61ed-4394-b3d0-4595526208b7	2025-11-30 17:00:00+00	2025-11-30 18:00:00+00	Programada	Limpieza	12.00	d91d86da-e1c6-4510-adf2-71f10303e9fe	\N	sera Pagado con Yape	2025-11-28 11:23:58.205959+00	Limpieza	\N
dcebb71c-49ae-445c-a530-1d0048a9ab76	4d24b29f-0155-461d-83d2-db32c4b74cbd	141b2519-daf3-4bf8-8dac-e97840181403	2025-11-30 17:00:00+00	2025-11-30 18:00:00+00	Programada	Control por brackets	100.00	d91d86da-e1c6-4510-adf2-71f10303e9fe	\N	Sera adelantado por yape	2025-11-28 14:07:27.320391+00	Control por brackets	\N
0086d962-a5e7-4366-8f3c-904bc689b305	17977759-62ad-4793-8b9e-9dc2b3652cd8	c955e2b0-07b0-455f-8ae5-acd9919fdde2	2025-11-29 00:51:00+00	2025-11-29 01:51:00+00	Programada		1855.00	d91d86da-e1c6-4510-adf2-71f10303e9fe	\N		2025-11-29 00:51:40.052731+00	Consulta odontológica	\N
698b170e-2d94-4d8c-8936-f2efdb9e01a8	4d24b29f-0155-461d-83d2-db32c4b74cbd	9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128	2025-11-30 17:00:00+00	2025-11-30 18:00:00+00	Programada	Limpieza	100.00	d91d86da-e1c6-4510-adf2-71f10303e9fe	\N	nota	2025-11-30 00:27:24.106261+00	Limpieza	\N
\.


--
-- Data for Name: cms_carrusel; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."cms_carrusel" ("id", "imagen_url", "alt_text", "orden", "visible", "created_at") FROM stdin;
\.


--
-- Data for Name: cms_equipo; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."cms_equipo" ("id", "nombre", "cargo", "especialidad", "foto_url", "orden", "visible", "created_at", "updated_at", "foto_public_id", "curriculum") FROM stdin;
bdca17c1-efef-43bb-97d2-41c215f2d636	Dra. Paola Peñaloza de La Torre	Odontóloga General	Cirujano dentista con experiencia en salud pública	https://res.cloudinary.com/dgyufp0xc/image/upload/c_fill,f_webp,g_face,h_400,q_auto:good,w_400/v1764433102/dental_company/equipo/1000278419_jpg_1764433102287.webp	3	t	2025-11-27 07:01:47.699609+00	2025-11-27 07:01:47.699609+00	dental_company/equipo/1000278419_jpg_1764433102287	{"filosofia": "Creo firmemente que la salud bucal es un derecho fundamental, no un privilegio. Mi trabajo se centra en reducir las brechas de acceso y desarrollar políticas públicas que garanticen atención odontológica de calidad para todos los segmentos de la población, especialmente los más vulnerables.", "formacion": ["Maestría en Odontología con mención de patología", "Diplomado en Políticas Públicas para el Acceso Universal a Salud Oral", "Cirujano dentista"], "experiencia": ["17 años de experiencia profesional", "10 años como odontóloga asistencial del Centro de Salud Leoncio Prado", "Responsable del servicio de odontología del centro de salud"], "especialidades": ["Epidemiología en salud bucal", "Planificación y evaluación de programas sanitarios", "Prevención y promoción de salud oral comunitaria"]}
8c223576-d848-445c-8a71-4ba35fcad6eb	María Patricia Revilla Loayza	Cirujano Dentista	Patología bucal	https://res.cloudinary.com/dgyufp0xc/image/upload/c_fill,f_webp,g_face,h_400,q_auto:good,w_400/v1764465049/dental_company/equipo/odontologo4_jpg_1764465049179.webp	4	t	2025-11-30 01:11:54.226394+00	2025-11-30 01:11:54.226394+00	dental_company/equipo/odontologo4_jpg_1764465049179	{"filosofia": "", "formacion": ["•\\tCirujano Dentista Universidad Nacional Jorge Basadre Grohmann. ", "•\\tMaestro en Odontología con mención en Patología. Universidad Católica Santa María", "•\\tSegunda Especialidad en Medicina y Patología Estomatológica. Universidad Peruana Cayetano Heredia."], "experiencia": ["•\\tRotación en el Departamento de Patología Quirúrgica. Instituto Nacional de Enfermedades Neoplásicas (INEN)", "•\\tRotación en el Departamento de Genética. Instituto Nacional de Salud del Niño (INSN)", "•\\tRotación en el Departamento de Infectología y Medicina Tropical. Instituto de Medicina Tropical Alexander Von Humboldt (Hospital Nacional Cayetano Heredia)", "•\\tPasantía internacional: Patología de los Huesos Maxilares y su Correlación Clínica y Radiológica. Instituto Latinoamericano de Altos Estudios en Estomatología (ILAE).", "•\\tMiembro de la Asociación Peruana de Medicina y Patología Bucal y Maxilofacial.", "•\\tDirectora del Centro de Diagnóstico en Medicina y Patología Estomatológica “PAES”. Tacna."], "especialidades": ["Patología bucal"]}
0711a4d1-b5c0-4b8c-90e0-d856fa330b7f	Dr. Ulises Peñaloza de La Torre	Director Médico	Especialista en Periodoncia e Implantología	/ulises_penaloza.jpeg	1	t	2025-11-27 07:01:47.699609+00	2025-11-27 07:01:47.699609+00		{"filosofia": "Mi objetivo es devolverle no solo la funcionalidad a la sonrisa de mis pacientes, sino también la confianza para reír sin preocupaciones. Utilizo tecnología de vanguardia para planificar cada caso de manera precisa y predecible con un enfoque en la salud integral de mis pacientes.", "formacion": ["Doctorado en Odontología", "Maestría en Odontología con mención en patología", "Maestría en Investigación e innovación científica", "Segunda Especialidad en Periodoncia e implantología", "Cirujano dentista"], "experiencia": ["17 años de experiencia profesional", "16 años como docente Universitario", "Investigador Renacyt", "Miembro de la Asociación Peruana de Periodoncia y osteointegración", "Ganador del concurso Nacional de Invenciones - INDECOPI (Patente frente al COVID)", "Diversas publicaciones en revistas científicas indexadas"], "especialidades": ["Implantes dentales post extracción", "Regeneración ósea guiada", "Prótesis sobre implantes", "Injertos de encía", "Tratamiento de periodontitis"]}
6601679c-8621-400e-8c27-256b696b7d86	Dra. Gabriela Condori Condori	Ortodoncista	Especialista en Ortodoncia y Ortopedia Maxilar	https://res.cloudinary.com/dgyufp0xc/image/upload/c_fill,f_webp,g_face,h_400,q_auto:good,w_400/v1764433087/dental_company/equipo/1000278420_jpg_1764433087159.webp	2	t	2025-11-27 07:01:47.699609+00	2025-11-27 07:01:47.699609+00	dental_company/equipo/1000278420_jpg_1764433087159	{"filosofia": "Cada sonrisa cuenta una historia única. Mi misión es crear tratamientos personalizados que se adapten al estilo de vida de cada paciente, utilizando los avances más modernos en ortodoncia.", "formacion": ["Maestría en Investigación e innovación científica", "Segunda Especialidad en Ortodoncia e ortopedia maxilar", "Cirujano dentista"], "experiencia": ["10 años de experiencia profesional", "Más de 100 casos tratados con ortodoncia", "Diversas publicaciones en revistas científicas indexadas"], "especialidades": ["Ortodoncia interceptiva en niños", "Ortodoncia con Brackets estéticos", "Disyunción maxilar"]}
\.


--
-- Data for Name: cms_secciones; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."cms_secciones" ("id", "seccion", "titulo", "subtitulo", "contenido", "orden", "visible", "updated_at", "updated_by") FROM stdin;
a057f943-3d99-46cc-82b5-a4af58156a90	hero	Clínica Dental Company	Tu sonrisa es nuestra sonrisa.	{"cta_url": "#reservas", "cta_texto": "Agenda tu Cita"}	1	t	2025-11-27 07:01:47.699609+00	\N
ab2bb711-33ef-4ed1-bf28-314568bd1c49	servicios	Nuestros Servicios	Desde revisiones de rutina hasta procedimientos especializados, ofrecemos una gama completa de tratamientos.	{}	2	t	2025-11-27 07:01:47.699609+00	\N
fbbff995-be98-4d22-b3e7-51b47a66b7d9	nosotros	Conoce a Nuestros Especialistas	\N	{}	3	t	2025-11-27 07:01:47.699609+00	\N
d4b0ef6c-2845-4dc3-888e-f0f71f8d9df0	contacto	Contáctanos	\N	{}	4	t	2025-11-27 07:01:47.699609+00	\N
3036cf0d-4a65-42fe-96b4-fd259540c736	footer	Dental Company	\N	{}	5	t	2025-11-27 07:01:47.699609+00	\N
\.


--
-- Data for Name: cms_servicio_imagenes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."cms_servicio_imagenes" ("id", "servicio_id", "imagen_url", "public_id", "descripcion", "alt_text", "orden", "visible", "created_at", "updated_at") FROM stdin;
a8254834-a02a-4477-ae54-e5a4dda7870b	96aafbe2-164f-4e6e-a3d3-7e9ab1538b98	https://res.cloudinary.com/dgyufp0xc/image/upload/c_limit,f_webp,q_auto:eco,w_1920/v1764521655/dental_company/servicios/servicio_96aafbe2_Muestra_2_png_1764521654617.webp	dental_company/servicios/servicio_96aafbe2_Muestra_2_png_1764521654617	\N	Odontología General	1	t	2025-11-30 16:54:19.598801+00	2025-11-30 16:54:30.484332+00
\.


--
-- Data for Name: cms_servicios; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."cms_servicios" ("id", "nombre", "descripcion", "icono", "orden", "visible", "created_at", "updated_at", "detalle_completo", "beneficios", "duracion", "recomendaciones") FROM stdin;
96aafbe2-164f-4e6e-a3d3-7e9ab1538b98	Odontología General	Consultas, diagnósticos, limpiezas profesionales y tratamiento de caries para un mantenimiento integral de tu salud bucal.	Stethoscope	1	t	2025-11-27 07:01:47.699609+00	2025-11-28 00:24:02.739626+00	La odontología general es la base de una buena salud bucal. Realizamos evaluaciones completas de tu boca, detectando problemas en etapas tempranas para un tratamiento más efectivo y menos invasivo. Incluye radiografías digitales, examen de encías, evaluación de mordida y un plan de tratamiento personalizado según tus necesidades.	{"Prevención de enfermedades bucales","Detección temprana de caries y problemas en las encías","Limpieza profunda que elimina sarro y manchas","Consejos personalizados para tu higiene diaria","Seguimiento continuo de tu salud dental"}	30-60 minutos por consulta	Te sugerimos visitarnos cada 6 meses para mantener tu sonrisa saludable. Recuerda cepillarte después de cada comida y usar hilo dental diariamente.
b26185da-9387-4232-90d8-ae13f68b9d93	Estética Dental	Desde blanqueamientos y carillas hasta coronas estéticas para un diseño de sonrisa perfecto y radiante.	Sparkles	2	t	2025-11-27 07:01:47.699609+00	2025-11-28 00:24:02.739626+00	Transformamos tu sonrisa con tratamientos estéticos de última generación. Utilizamos tecnología digital para diseñar tu sonrisa ideal antes del tratamiento, permitiéndote ver cómo lucirás al finalizar. Trabajamos con materiales de alta calidad que garantizan resultados naturales y duraderos.	{"Sonrisa más blanca y brillante","Corrección de forma, tamaño y color de dientes","Resultados naturales que lucen como tus propios dientes","Aumento de la autoestima y confianza","Materiales seguros y de larga duración"}	1-3 citas según el tratamiento	Después del blanqueamiento, evita por 48 horas café, té, vino tinto y alimentos con colorantes. Mantén una buena higiene para que los resultados duren más tiempo.
70826127-2d1b-47fb-baf7-f2ace06f93ff	Ortodoncia	Corrección de la posición dental con brackets metálicos, estéticos y tratamientos interceptivos para niños.	Smile	3	t	2025-11-27 07:01:47.699609+00	2025-11-28 00:24:02.739626+00	Corregimos la posición de tus dientes y mejoramos tu mordida con tratamientos ortodónticos personalizados. Ofrecemos brackets tradicionales, estéticos (de cerámica transparente) y tratamientos especiales para niños que previenen problemas mayores en el futuro. La Dra. Gabriela Condori, especialista en ortodoncia con más de 10 años de experiencia, evaluará tu caso individualmente.	{"Dientes perfectamente alineados","Mejora de la mordida para masticar mejor","Prevención de desgaste dental","Mayor facilidad para cepillarte y usar hilo dental","Mejora notable de tu perfil facial"}	12-24 meses promedio	Asiste puntualmente a tus controles mensuales. Evita alimentos duros o pegajosos que puedan dañar los brackets. Usa los cepillos especiales que te proporcionamos para limpiar alrededor de los brackets.
7af30651-0966-47c2-b4a4-c978e3ff513f	Implantes Dentales	Soluciones permanentes para la pérdida de dientes, incluyendo implantes unitarios, múltiples y prótesis fijas.	Bone	4	t	2025-11-27 07:01:47.699609+00	2025-11-28 00:24:02.739626+00	Los implantes dentales son la solución más avanzada y duradera para reemplazar dientes perdidos. Utilizamos implantes de titanio de alta calidad que se integran perfectamente con el hueso. El Dr. Ulises Peñaloza, especialista en implantología con 17 años de experiencia, ofrece técnicas de carga inmediata que permiten colocar dientes provisionales el mismo día de la cirugía.	{"Solución permanente para dientes perdidos","Lucen y funcionan como dientes naturales","Mantienen saludable el hueso de tu mandíbula","No dañan los dientes vecinos","Pueden durar toda la vida con el cuidado adecuado"}	3-6 meses para integración completa	Durante los primeros días después de la cirugía, consume alimentos blandos y fríos. No fumes, ya que afecta la cicatrización. Sigue todas las indicaciones que te daremos para asegurar el éxito del implante.
8a1684c6-3883-4fbe-abb2-797b94ae906d	Cirugía Bucal	Procedimientos quirúrgicos como extracciones de cordales, cirugía periodontal e injertos de hueso y encía.	Syringe	5	t	2025-11-27 07:01:47.699609+00	2025-11-28 00:24:02.739626+00	Realizamos procedimientos quirúrgicos con técnicas modernas y mínimamente invasivas para reducir molestias y acelerar tu recuperación. Nuestro equipo está especializado en extracciones complejas, incluyendo muelas del juicio que no han salido correctamente, y cirugías de regeneración para preparar tu boca para implantes.	{"Procedimientos con mínimas molestias","Recuperación más rápida que con técnicas tradicionales","Anestesia efectiva para un procedimiento sin dolor","Seguimiento incluido después de la cirugía","Prevención de complicaciones a futuro"}	30-90 minutos según el procedimiento	Después de la cirugía, descansa el resto del día y aplica hielo en la zona por intervalos de 15 minutos. Come alimentos blandos y fríos. Evita enjuagues fuertes las primeras 24 horas. Te daremos medicación para controlar cualquier molestia.
c45bbe4c-8fe2-4948-98ca-5822b9c97e55	Endodoncia	Tratamiento de conductos radiculares para salvar dientes afectados por caries profundas o traumatismos.	Microscope	6	t	2025-11-27 07:01:47.699609+00	2025-11-28 00:24:02.739626+00	La endodoncia permite salvar dientes que de otra manera tendrían que ser extraídos. Este tratamiento, conocido popularmente como 'matar el nervio', elimina la infección interna del diente, limpia completamente los conductos y los sella para prevenir futuras infecciones. Con las técnicas modernas que utilizamos, el procedimiento es prácticamente indoloro.	{"Salva dientes que parecían perdidos","Elimina el dolor intenso causado por la infección","Procedimiento prácticamente sin dolor","Conserva tu diente natural en lugar de reemplazarlo","Evita la necesidad de implantes o prótesis"}	1-2 citas de 60-90 minutos	Es normal sentir sensibilidad los primeros días; esto pasará gradualmente. Evita masticar con ese diente hasta que te coloquemos la corona definitiva. Toma los medicamentos según las indicaciones para una recuperación cómoda.
cbc47ead-28c3-457f-90f0-072fb9eb0e01	Periodoncia	Tratamiento especializado de encías, incluyendo manejo de gingivitis, periodontitis y cirugía regenerativa.	ShieldCheck	7	t	2025-11-27 07:01:47.699609+00	2025-11-28 00:24:02.739626+00	Tratamos las enfermedades de las encías, desde inflamación leve hasta casos avanzados donde hay pérdida de hueso. El Dr. Ulises Peñaloza, especialista en periodoncia, puede detener la progresión de la enfermedad y en muchos casos regenerar los tejidos perdidos. Las encías sanas son fundamentales porque la enfermedad de las encías es la principal causa de pérdida de dientes en adultos.	{"Encías saludables que no sangran al cepillarte","Prevención de pérdida de dientes","Eliminación del mal aliento causado por bacterias","Posibilidad de recuperar hueso perdido","Mejor salud general (las encías enfermas afectan el corazón y otros órganos)"}	Varias sesiones según la severidad	Después del tratamiento, tus encías pueden estar sensibles por unos días. Usa el enjuague especial que te recetaremos. Es muy importante que asistas a tus citas de mantenimiento cada 3-4 meses para evitar que la enfermedad regrese.
62416f52-e32b-4874-a5d0-6e983a17e54d	Odontopediatría	Atención dental especializada y amigable para los más pequeños, enfocada en la prevención y el manejo de conducta.	Baby	8	t	2025-11-27 07:01:47.699609+00	2025-11-28 00:24:02.739626+00	Brindamos atención dental especializada para los más pequeños de la casa en un ambiente amigable y libre de miedo. Utilizamos técnicas especiales de comunicación para que los niños tengan experiencias positivas en el dentista desde temprana edad. Nos enfocamos en la prevención para asegurar que sus dientes crezcan sanos y fuertes.	{"Ambiente diseñado para que los niños se sientan cómodos","Prevención de caries desde los primeros dientes","Enseñamos higiene oral de forma divertida","Sellantes que protegen las muelitas de las caries","Detección temprana si necesitarán ortodoncia"}	20-40 minutos por sesión	La primera visita al dentista debe ser al cumplir el primer año o cuando salga el primer diente. Supervisa el cepillado de tu hijo hasta los 7-8 años. Limita los dulces y jugos azucarados, especialmente antes de dormir.
9c187b68-66a5-491d-aa1f-d8d7cc29b40a	Prótesis Dental	Restauración de la función y estética con coronas, puentes fijos y prótesis removibles o totales.	Puzzle	9	t	2025-11-27 07:01:47.699609+00	2025-11-28 00:24:02.739626+00	Restauramos la función y belleza de tu sonrisa con prótesis dentales hechas a tu medida. Trabajamos con materiales modernos como el zirconio que lucen completamente naturales. Ofrecemos desde coronas individuales para un solo diente hasta rehabilitaciones completas para quienes han perdido todos sus dientes.	{"Vuelve a masticar todos tus alimentos favoritos","Sonrisa restaurada con apariencia natural","Materiales resistentes que duran muchos años","Ajuste cómodo y preciso","Mejora de la pronunciación al hablar"}	2-4 citas según el tipo de prótesis	Si tienes prótesis removible, retírala para dormir y mantenla limpia. Las prótesis fijas se cuidan igual que los dientes naturales. Visítanos regularmente para verificar el ajuste y hacer mantenimiento.
eff016e7-1d42-46ab-b4a5-505adcfcb295	Diagnóstico de Patologías	Detección temprana y diagnóstico de lesiones, infecciones y otras patologías de la mucosa oral.	FileSearch	10	t	2025-11-27 07:01:47.699609+00	2025-11-28 00:24:02.739626+00	Realizamos exámenes completos de toda tu boca para detectar cualquier lesión que requiera atención. La detección temprana de problemas serios, incluyendo lesiones pre-cancerosas y cáncer oral, es crucial para un tratamiento exitoso. Si encontramos algo que necesite evaluación especializada, te guiaremos en los siguientes pasos.	{"La detección temprana puede salvar tu vida","Diagnóstico preciso de cualquier lesión en la boca","Seguimiento de manchas o llagas sospechosas","Coordinación con especialistas si es necesario","Tranquilidad de saber que todo está bien"}	30-45 minutos de evaluación	Revisa tu boca mensualmente frente al espejo. Consulta de inmediato si notas llagas que no sanan en 2 semanas, manchas blancas o rojas, bultos, o cualquier cambio inusual. No te alarmes, la mayoría de las lesiones son benignas, pero es mejor verificar.
64043775-3e9d-4382-9813-78782f1051b4	Servicio	Servicio de odontología	Bone	11	f	2025-11-30 01:05:40.181284+00	2025-11-30 01:06:16.614239+00	Es un servicio x	{x}	x	Sin recomendaciones
\.


--
-- Data for Name: cms_tema; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."cms_tema" ("id", "clave", "valor", "tipo", "descripcion", "grupo", "updated_at") FROM stdin;
73c30ea9-6ce3-4d1a-bf41-ff44e0b54b8e	color_acento	#22c55e	color	Color de acento (verde)	colores	2025-11-27 07:01:47.699609+00
7824306c-ef32-4f56-a3f3-49a549190849	color_fondo	#ffffff	color	Color de fondo principal	colores	2025-11-27 07:01:47.699609+00
14531c97-04bf-4b3f-b098-a78d692a2901	color_texto	#1f2937	color	Color de texto principal	colores	2025-11-27 07:01:47.699609+00
53dcd41e-69ff-4375-a436-d58e5624a7f2	slogan	Tu sonrisa es nuestra sonrisa.	otro	Slogan principal	general	2025-11-27 07:01:47.699609+00
1e8c0681-1538-475d-afde-b301dbe43a93	color_primario	#3b82f6	otro	Color principal de la marca (azul)	colores	2025-11-27 07:01:47.699609+00
eb9f8eb4-4699-484f-98a7-9c84802085e1	color_secundario	#1e40af	otro	Color secundario (azul oscuro)	colores	2025-11-27 07:01:47.699609+00
8b2d6687-deef-45bb-8256-96cdd04ccd80	chatbot_system_prompt	Eres el asistente virtual de Dental Company, una clínica dental en Tacna, Perú.\n\nTU ROL:\n- Responde de manera amable, profesional y empática\n- Proporciona información clara y precisa sobre servicios dentales\n- Si no tienes información específica, invita al usuario a contactar directamente a la clínica\n- Usa emojis ocasionalmente para hacer la conversación más amigable 😊\n- Sé breve y directo en tus respuestas\n- Nunca inventes información médica o precios si no los tienes\n\nIMPORTANTE:\n- NO proporciones diagnósticos médicos\n- NO recomiendes tratamientos específicos sin evaluación profesional\n- SIEMPRE recomienda agendar una cita para evaluación personalizada\n- No menciones que eres una IA o modelo de lenguaje, no te salgas de tu rol de asistente de Dental Company	otro	Prompt personalizado para definir la personalidad del chatbot	chatbot	2025-11-30 16:21:38.605+00
f2ba1210-2dbe-4ba5-8734-bba3b974c64b	chatbot_usar_servicios	true	otro	Incluir los servicios de la clínica como contexto del chatbot	chatbot	2025-11-30 16:34:04.687+00
4aea3ebd-c01f-4c3e-b640-cc864c45a929	chatbot_usar_info_general	true	otro	Incluir información general de la clínica como contexto del chatbot	chatbot	2025-11-30 16:40:26.136+00
04f42dfa-18f1-4014-ba33-3cd898bf9cda	chatbot_usar_equipo	true	otro	Incluir información del equipo médico como contexto del chatbot	chatbot	2025-11-30 16:40:29.525+00
f25e2850-fb9e-4d22-b3bc-6619cdb66b35	email	d.c.com@hotmail.com	otro	Email de contacto	contacto	2025-11-27 07:01:47.699609+00
d059bf28-9910-436d-bab6-f731c5d9b414	telefono	+51 952 864 883	otro	Teléfono de contacto	contacto	2025-11-27 07:01:47.699609+00
5b89f70b-5148-49c2-82e9-3580ae0d4778	direccion	Av. General Suarez N° 312, Tacna, Perú	otro	Dirección física	contacto	2025-11-27 07:01:47.699609+00
256559c8-c53f-4b7b-bdc2-3dd3d812af8d	horario_sabado	Sábados: 9:00 AM - 1:00 PM	otro	Horario sábados	contacto	2025-11-27 07:01:47.699609+00
5210f8f3-66e9-4b8b-9990-f927bc39cd01	horario_semana	Lunes a Viernes: 9:00 AM - 7:00 PM	otro	Horario entre semana	contacto	2025-11-27 07:01:47.699609+00
d2fcdaef-eceb-4d3d-8993-6e51f7d7e632	whatsapp_numero	51952864883	otro	Número de WhatsApp para contacto	contacto	2025-11-27 07:01:47.699609+00
5da4aded-3d25-42df-b62d-d3fbdbd0af1c	nombre_clinica	Dental Company	otro	Nombre de la clínica	general	2025-11-27 07:01:47.699609+00
\.


--
-- Data for Name: codigos_invitacion; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."codigos_invitacion" ("id", "codigo", "creado_por", "usado_por", "rol_asignado", "usos_maximos", "usos_actuales", "activo", "expira_at", "created_at", "used_at") FROM stdin;
cca0c367-2135-4fae-b821-a7cb025242a9	DENTAL2025	\N	\N	Odontólogo	10	6	t	\N	2025-11-27 07:01:47.699609+00	\N
9740e2f4-b489-44c1-a99a-a4c6fd3a1501	ADMIN2025	\N	7fd13530-51f9-406e-b127-8377e2832830	Administrador	10	3	t	\N	2025-11-27 07:01:47.699609+00	2025-11-30 00:22:50.457+00
3338bf95-84ab-4532-8b02-1bd9d57fa1e5	DC-7M0OL7	7fd13530-51f9-406e-b127-8377e2832830	\N	Odontólogo	3	0	t	\N	2025-11-30 00:59:15.492005+00	\N
\.


--
-- Data for Name: config_seguridad; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."config_seguridad" ("id", "clave", "valor", "descripcion", "updated_at") FROM stdin;
00fd0caa-b79e-47bd-875d-7d2bbccc6b6a	requiere_aprobacion_admin	true	Los nuevos usuarios requieren aprobación de un admin para acceder.	2025-11-27 07:01:47.699609+00
b1c4f613-e9ba-44dc-af5f-6fc3f93b9975	registro_publico_habilitado	false	Si es true, cualquiera puede registrarse. Si es false, requiere código de invitación.	2025-11-30 01:17:43.609+00
\.


--
-- Data for Name: consentimientos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."consentimientos" ("id", "caso_id", "paciente_id", "tipo", "documento_url", "firmado", "firmado_por", "fecha_firma") FROM stdin;
\.


--
-- Data for Name: cuestionario_respuestas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."cuestionario_respuestas" ("id", "historia_id", "seccion", "pregunta", "respuesta_si_no", "respuesta_texto", "respuesta_opciones", "detalle") FROM stdin;
6139138d-0c32-4503-985d-d1036825a2a8	1abf3ed0-051c-4051-98f7-f7f793b1f998	generales	¿Está usted bajo tratamiento médico?	t	\N	\N	asasa
\.


--
-- Data for Name: diagnosticos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."diagnosticos" ("id", "caso_id", "odontologo_id", "tipo", "fecha", "cie10_id") FROM stdin;
5144bf13-5983-4f79-8d9d-62ff4939c2bb	525db4d5-81e2-46df-b37e-623ec75ec28d	141b2519-daf3-4bf8-8dac-e97840181403	Preliminar	2025-11-18 02:26:30.352213+00	8
8eddca39-0d3f-4fb2-b607-18ab868369f9	525db4d5-81e2-46df-b37e-623ec75ec28d	141b2519-daf3-4bf8-8dac-e97840181403	Definitivo	2025-11-18 02:57:00.734082+00	9
77f46f90-c613-4820-84df-5071f382e5e9	525db4d5-81e2-46df-b37e-623ec75ec28d	482031d1-1a76-46b2-afa6-2cb569b219c5	Definitivo	2025-11-24 15:36:33.233397+00	4
43848795-5714-45dd-b63a-d729bbcb331b	525db4d5-81e2-46df-b37e-623ec75ec28d	482031d1-1a76-46b2-afa6-2cb569b219c5	Definitivo	2025-11-24 18:09:08.03873+00	8
65bd0779-2bcf-4e11-9821-c1b710b6eef0	88a53314-4636-4fac-8787-48e4b2e865b5	7fd13530-51f9-406e-b127-8377e2832830	Preliminar	2025-11-30 00:42:06.396684+00	1
2acfae5a-501f-4e9e-93b5-e697dab007e0	dac8defe-13d7-47cd-ba6f-02f4a965e8e0	7fd13530-51f9-406e-b127-8377e2832830	Preliminar	2025-11-30 17:44:15.914315+00	1
\.


--
-- Data for Name: grupos_procedimiento; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."grupos_procedimiento" ("id", "nombre", "descripcion", "unidad_id") FROM stdin;
e31a4133-a3eb-4882-9461-8e3e6ed8245c	Ortodoncia	Tratamientos de corrección dental	\N
d08ba8f6-e7c8-4568-a0d9-103bb789c14e	Endodoncia	Tratamientos de conducto	\N
a3bdb5f3-27fa-4d34-a745-d0bdf986366d	Periodoncia	Tratamiento de encías	\N
3ae35075-9837-46c9-b4e0-20c81f920073	Odontología General	Consultas y procedimientos generales	\N
27500606-7469-4030-a37a-46baf4876f35	Cirugía Oral	Extracciones y cirugías	\N
4facbb29-1375-4b72-9f4a-021597dd12c9	Rehabilitación Oral	Prótesis y coronas	\N
d2fcf0e3-4d1c-47cc-9759-39b99c8dc36c	Estética Dental	Blanqueamientos y carillas	\N
2c308667-2345-448d-9a5f-3fde5bb8ef87	Odontopediatría	Tratamientos para niños	\N
a290b1f0-8a15-45d3-a588-b996fdfcdb9a	Radiología	Estudios radiográficos	\N
\.


--
-- Data for Name: historias_clinicas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."historias_clinicas" ("id", "paciente_id", "created_at", "updated_at") FROM stdin;
1abf3ed0-051c-4051-98f7-f7f793b1f998	0493cea8-0c9c-4f9c-bb4a-cea37b2112d6	2025-10-09 08:26:23.600313+00	2025-10-09 08:26:23.600313+00
53fdb730-d473-48c1-b88f-ba630b689bf6	238e93b1-f9e5-4c58-8e67-72b68cfdd5e1	2025-10-29 08:17:41.490505+00	2025-10-29 08:17:41.490505+00
e4d2b641-a87f-4dca-ab8c-ad7f2ef58101	6be7bfe6-1450-4a43-8027-5f4d258dedca	2025-11-27 17:10:54.689975+00	2025-11-27 17:10:54.689975+00
51197143-e6da-4f53-9d5c-ebe21bf62e33	4d24b29f-0155-461d-83d2-db32c4b74cbd	2025-11-27 20:01:33.186595+00	2025-11-27 20:01:33.186595+00
9984a620-1272-4fd3-b24c-3f78555d8f67	667a5ada-2c47-4397-8598-a02a91478962	2025-11-29 00:46:32.985153+00	2025-11-29 00:46:32.985153+00
135883be-629f-45ac-8de5-aa8da228b9b8	73cfbbe8-7693-487b-8958-30e6812932f6	2025-11-30 16:59:32.66651+00	2025-11-30 16:59:32.66651+00
\.


--
-- Data for Name: imagenes_pacientes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."imagenes_pacientes" ("id", "paciente_id", "tipo", "url", "public_id", "fecha_subida", "descripcion", "caso_id", "etapa", "fecha_captura", "es_principal") FROM stdin;
13c943ca-a416-4cd4-a4e9-bfd944f426a9	0493cea8-0c9c-4f9c-bb4a-cea37b2112d6	seguimiento	https://res.cloudinary.com/dgyufp0xc/image/upload/v1759900060/0002/seguimiento/0002_2025-10-08.webp	0002/seguimiento/0002_2025-10-08	2025-10-08 05:07:40.881932+00	asas	\N	durante	\N	f
4eee3b89-b32f-4be2-9978-2465e325e407	0493cea8-0c9c-4f9c-bb4a-cea37b2112d6	seguimiento	https://res.cloudinary.com/dgyufp0xc/image/upload/v1759998052/0002/seguimiento/0002_2025-10-09.webp	0002/seguimiento/0002_2025-10-09	2025-10-09 08:20:53.599757+00	asd	\N	durante	\N	f
a98fa16e-c725-4a81-926a-ffa7de4d25d1	0493cea8-0c9c-4f9c-bb4a-cea37b2112d6	seguimiento	https://res.cloudinary.com/dgyufp0xc/image/upload/v1760021048/0002/seguimiento/0002_seguimiento_2025-10-09T14:44:06.668Z.webp	0002/seguimiento/0002_seguimiento_2025-10-09T14:44:06.668Z	2025-10-09 14:44:08.940148+00	ccvnvb	\N	durante	\N	f
bface45a-8f44-40bb-9550-9665f6e6afae	0493cea8-0c9c-4f9c-bb4a-cea37b2112d6	radiografia	https://res.cloudinary.com/dgyufp0xc/image/upload/v1760022696/0002/radiografia/0002_radiografia_2025-10-09T15:11:29.028Z.webp	0002/radiografia/0002_radiografia_2025-10-09T15:11:29.028Z	2025-10-09 15:11:42.43978+00	xcvxc	\N	durante	\N	f
5c3bc199-84df-4d0a-8696-db71cf9f6473	0493cea8-0c9c-4f9c-bb4a-cea37b2112d6	otro	https://res.cloudinary.com/dgyufp0xc/image/upload/v1760022749/0002/otro/0002_otro_2025-10-09T15:12:12.886Z.webp	0002/otro/0002_otro_2025-10-09T15:12:12.886Z	2025-10-09 15:12:34.880837+00	xzx	\N	durante	\N	f
1138e51c-4f33-4d66-9d01-94f6aa61718a	6be7bfe6-1450-4a43-8027-5f4d258dedca	retrato	https://res.cloudinary.com/dgyufp0xc/image/upload/c_limit,f_webp,q_auto:best,w_2000/v1764525135/dental_company/pacientes/6be7bfe6-1450-4a43-8027-5f4d258dedca/muni_samegua_jpg_1764525133057.webp	dental_company/pacientes/6be7bfe6-1450-4a43-8027-5f4d258dedca/muni_samegua_jpg_1764525133057	2025-11-30 17:52:17.774174+00	\N	\N	antes	2025-11-30	f
\.


--
-- Data for Name: monedas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."monedas" ("id", "codigo", "nombre", "simbolo") FROM stdin;
d91d86da-e1c6-4510-adf2-71f10303e9fe	PEN	Soles Peruanos	S/
914f3b56-bb4c-41ae-9432-c1dd72147088	USD	Dólares Americanos	$
ec50ecaf-0cb9-4ba8-aafd-7b84756535f8	CLP	Pesos Chilenos	CLP$
\.


--
-- Data for Name: numero_historia_secuencia; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."numero_historia_secuencia" ("año", "ultimo_numero") FROM stdin;
2025	4526
\.


--
-- Data for Name: odontogramas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."odontogramas" ("id", "paciente_id", "odontograma_data", "fecha_registro", "version", "especificaciones", "observaciones") FROM stdin;
d0919131-4b7a-4ba5-8b8a-7b93eeae0dd2	17977759-62ad-4793-8b9e-9dc2b3652cd8	{"12": {"zonas": [], "generales": [{"icon": "aof_12_24_red", "condicion": "linea Aparato ortodóntico fijo"}, {"icon": "aparato_inicio_red", "condicion": "Aparato ortodóntico fijo - inicio"}]}, "24": {"zonas": [], "generales": [{"icon": "aparato_fin_red", "condicion": "Aparato ortodóntico fijo - fin"}]}}	2025-10-29 15:04:52.818666+00	1	\N	\N
0dee73c4-92da-46d5-a687-e4cfb18614ba	17977759-62ad-4793-8b9e-9dc2b3652cd8	{"12": {"zonas": [], "generales": [{"icon": "aof_12_24_red", "condicion": "linea Aparato ortodóntico fijo"}, {"icon": "aparato_inicio_red", "condicion": "Aparato ortodóntico fijo - inicio"}]}, "24": {"zonas": [], "generales": [{"icon": "aparato_fin_red", "condicion": "Aparato ortodóntico fijo - fin"}]}, "34": {"zonas": [], "generales": [{"icon": "aparato_remo_fin_blue", "condicion": "Aparato ortodóntico removible - fin"}]}, "43": {"zonas": [], "generales": [{"icon": "aor_43_34_blue", "condicion": "linea Aparato ortodóntico removible"}, {"icon": "aparato_remo_inicio_blue", "condicion": "Aparato ortodóntico removible - inicio"}]}}	2025-10-29 15:05:00.611888+00	2	\N	\N
7feb4d7f-ac18-42aa-a748-f89917d0d18e	bef88313-ecbe-4c78-b0d8-2dd7083afc8e	{"12": {"zonas": [], "generales": [{"icon": "aor_12_23_red", "condicion": "linea Aparato ortodóntico removible"}, {"icon": "aparato_remo_inicio_red", "condicion": "Aparato ortodóntico removible - inicio"}]}, "23": {"zonas": [], "generales": [{"icon": "aparato_remo_fin_red", "condicion": "Aparato ortodóntico removible - fin"}]}}	2025-10-29 15:05:09.152208+00	1	\N	\N
40f38cfe-66d6-443b-8630-ef39984b38da	238e93b1-f9e5-4c58-8e67-72b68cfdd5e1	{"13": {"zonas": [], "generales": [{"icon": "square_CM_R", "color": "red", "label": "CM", "condicion": "Corona"}]}}	2025-10-29 15:05:56.416121+00	1	\N	\N
76b0cb58-dd2d-44cf-90ce-3c2e317e3d0b	bef88313-ecbe-4c78-b0d8-2dd7083afc8e	{"12": {"zonas": [], "generales": [{"icon": "aor_12_23_red", "condicion": "linea Aparato ortodóntico removible"}, {"icon": "aparato_remo_inicio_red", "condicion": "Aparato ortodóntico removible - inicio"}]}, "14": {"zonas": [], "generales": [{"icon": "square_CM_R", "color": "red", "label": "CM", "condicion": "Corona"}]}, "23": {"zonas": [], "generales": [{"icon": "aparato_remo_fin_red", "condicion": "Aparato ortodóntico removible - fin"}]}}	2025-10-29 15:06:04.671211+00	2	\N	\N
7e0c7108-002f-489f-9b4e-657e71e1cb68	bef88313-ecbe-4c78-b0d8-2dd7083afc8e	{"12": {"zonas": [], "generales": [{"icon": "aor_12_23_red", "condicion": "linea Aparato ortodóntico removible"}, {"icon": "aparato_remo_inicio_red", "condicion": "Aparato ortodóntico removible - inicio"}]}, "14": {"zonas": [], "generales": [{"icon": "square_CM_R", "color": "red", "label": "CM", "condicion": "Corona"}]}, "17": {"zonas": [{"zona": "vestibular", "color": "red", "condicion": "Lesión de caries dental"}], "generales": [{"icon": "triangle_CD_R", "color": "red", "label": "CD", "condicion": "Lesión de caries dental"}]}, "23": {"zonas": [], "generales": [{"icon": "aparato_remo_fin_red", "condicion": "Aparato ortodóntico removible - fin"}]}, "34": {"zonas": [], "generales": [{"icon": "supernumeraria_izq_blue", "color": "blue", "condicion": "supernumeraria"}]}, "36": {"zonas": [], "generales": [{"icon": "tratamiento_conducto_TC_R", "color": "red", "label": "TC", "condicion": "Tratamiento de conducto (TC) / Pulpectomía (PC)"}]}, "42": {"zonas": [{"zona": "oclusal", "color": "red", "condicion": "Pulpotomía"}], "generales": [{"icon": "circle_PP_R", "color": "red", "label": "PP", "condicion": "Pulpotomía"}]}, "47": {"zonas": [{"zona": "vestibular", "color": "red", "condicion": "Lesión de caries dental"}], "generales": [{"icon": "triangle_CDP_R", "color": "red", "label": "CDP", "condicion": "Lesión de caries dental"}]}}	2025-10-29 15:07:35.752702+00	3	\N	\N
b4e4da84-3607-4a42-aa07-d7a0188a76be	bef88313-ecbe-4c78-b0d8-2dd7083afc8e	{"15": {"zonas": [], "generales": [{"icon": "ausente_DEX_B", "color": "blue", "label": "DEX", "condicion": "Pieza dentaria ausente"}]}, "16": {"zonas": [], "generales": [{"icon": "square_CM_R", "color": "red", "label": "CM", "condicion": "Corona"}]}}	2025-10-29 15:13:54.51163+00	4	\N	\N
f94cc04a-386a-41eb-95fe-00c1be365f9e	0493cea8-0c9c-4f9c-bb4a-cea37b2112d6	{"17": {"zonas": [], "generales": [{"icon": "circle_M1_R", "color": "red", "label": "M1", "condicion": "Movilidad patológica"}]}}	2025-10-29 15:15:16.484493+00	1	\N	\N
f1a4e562-1218-495b-b348-a711f8f19fbe	0493cea8-0c9c-4f9c-bb4a-cea37b2112d6	{"16": {"zonas": [], "generales": [{"icon": "erupcion_blue", "color": "blue", "condicion": "erupcion"}]}}	2025-10-29 15:15:23.870097+00	2	\N	\N
894b38c3-af31-492b-9bd9-d0b56d4014e7	17977759-62ad-4793-8b9e-9dc2b3652cd8	{"12": {"zonas": [], "generales": [{"icon": "aof_12_24_red", "condicion": "linea Aparato ortodóntico fijo"}, {"icon": "aparato_inicio_red", "condicion": "Aparato ortodóntico fijo - inicio"}]}, "14": {"zonas": [], "generales": [{"icon": "square_CF_R", "color": "red", "label": "CF", "condicion": "Corona"}]}, "24": {"zonas": [], "generales": [{"icon": "aparato_fin_red", "condicion": "Aparato ortodóntico fijo - fin"}]}, "34": {"zonas": [], "generales": [{"icon": "aparato_remo_fin_blue", "condicion": "Aparato ortodóntico removible - fin"}]}, "43": {"zonas": [], "generales": [{"icon": "aor_43_34_blue", "condicion": "linea Aparato ortodóntico removible"}, {"icon": "aparato_remo_inicio_blue", "condicion": "Aparato ortodóntico removible - inicio"}]}}	2025-10-29 15:17:54.930314+00	3	\N	\N
9a28f838-a2fa-495e-b2b8-b0fcfb4f3aeb	17977759-62ad-4793-8b9e-9dc2b3652cd8	{"12": {"zonas": [], "generales": [{"icon": "aof_12_24_red", "condicion": "linea Aparato ortodóntico fijo"}, {"icon": "aparato_inicio_red", "condicion": "Aparato ortodóntico fijo - inicio"}]}, "14": {"zonas": [], "generales": [{"icon": "square_CF_R", "color": "red", "label": "CF", "condicion": "Corona"}]}, "24": {"zonas": [], "generales": [{"icon": "aparato_fin_red", "condicion": "Aparato ortodóntico fijo - fin"}]}, "34": {"zonas": [], "generales": [{"icon": "aparato_remo_fin_blue", "condicion": "Aparato ortodóntico removible - fin"}]}, "43": {"zonas": [], "generales": [{"icon": "aor_43_34_blue", "condicion": "linea Aparato ortodóntico removible"}, {"icon": "aparato_remo_inicio_blue", "condicion": "Aparato ortodóntico removible - inicio"}]}}	2025-10-29 15:19:19.407043+00	4	\N	\N
5d6190ae-2ace-43be-be01-28b779b62d0c	17977759-62ad-4793-8b9e-9dc2b3652cd8	{"12": {"zonas": [], "generales": [{"icon": "aof_12_24_red", "condicion": "linea Aparato ortodóntico fijo"}, {"icon": "aparato_inicio_red", "condicion": "Aparato ortodóntico fijo - inicio"}]}, "14": {"zonas": [], "generales": [{"icon": "square_CF_R", "color": "red", "label": "CF", "condicion": "Corona"}]}, "24": {"zonas": [], "generales": [{"icon": "aparato_fin_red", "condicion": "Aparato ortodóntico fijo - fin"}]}, "34": {"zonas": [], "generales": [{"icon": "aparato_remo_fin_blue", "condicion": "Aparato ortodóntico removible - fin"}]}, "43": {"zonas": [], "generales": [{"icon": "aor_43_34_blue", "condicion": "linea Aparato ortodóntico removible"}, {"icon": "aparato_remo_inicio_blue", "condicion": "Aparato ortodóntico removible - inicio"}]}}	2025-10-29 15:19:23.160461+00	5	\N	\N
7b22c1db-1ba9-4ee2-93dc-db2054d6115f	17977759-62ad-4793-8b9e-9dc2b3652cd8	{"12": {"zonas": [], "generales": [{"icon": "aof_12_24_red", "condicion": "linea Aparato ortodóntico fijo"}, {"icon": "aparato_inicio_red", "condicion": "Aparato ortodóntico fijo - inicio"}]}, "14": {"zonas": [], "generales": [{"icon": "square_CF_R", "color": "red", "label": "CF", "condicion": "Corona"}]}, "24": {"zonas": [], "generales": [{"icon": "aparato_fin_red", "condicion": "Aparato ortodóntico fijo - fin"}]}, "34": {"zonas": [], "generales": [{"icon": "aparato_remo_fin_blue", "condicion": "Aparato ortodóntico removible - fin"}]}, "43": {"zonas": [], "generales": [{"icon": "aor_43_34_blue", "condicion": "linea Aparato ortodóntico removible"}, {"icon": "aparato_remo_inicio_blue", "condicion": "Aparato ortodóntico removible - inicio"}]}}	2025-10-29 15:19:24.875668+00	6	\N	\N
21578a39-872f-4f42-9f55-452125659265	bef88313-ecbe-4c78-b0d8-2dd7083afc8e	{"15": {"zonas": [], "generales": [{"icon": "ausente_DEX_B", "color": "blue", "label": "DEX", "condicion": "Pieza dentaria ausente"}]}, "16": {"zonas": [], "generales": [{"icon": "square_CM_R", "color": "red", "label": "CM", "condicion": "Corona"}]}}	2025-10-29 15:21:22.375642+00	5	\N	\N
1da4ecfc-1d3e-48a8-a849-adf8147e5d3b	0493cea8-0c9c-4f9c-bb4a-cea37b2112d6	{"16": {"zonas": [], "generales": [{"icon": "erupcion_blue", "color": "blue", "condicion": "erupcion"}]}}	2025-10-29 15:22:17.131344+00	3	\N	\N
751404e3-0489-4ee4-b01d-5552526592f2	0493cea8-0c9c-4f9c-bb4a-cea37b2112d6	{"16": {"zonas": [], "generales": [{"icon": "erupcion_blue", "color": "blue", "condicion": "erupcion"}]}}	2025-10-29 15:22:33.532794+00	4	\N	\N
2d66f598-8d76-421a-bb63-20db98367793	0493cea8-0c9c-4f9c-bb4a-cea37b2112d6	{"16": {"zonas": [], "generales": [{"icon": "erupcion_blue", "color": "blue", "condicion": "erupcion"}]}}	2025-10-29 15:22:37.233095+00	5	\N	\N
4d5ab6b8-aa19-47fb-9630-950a48b72d2c	0493cea8-0c9c-4f9c-bb4a-cea37b2112d6	{"16": {"zonas": [], "generales": [{"icon": "erupcion_blue", "color": "blue", "condicion": "erupcion"}]}}	2025-10-29 15:23:02.732534+00	6	\N	\N
249104df-54c3-46dc-a3ca-33674a6b966d	238e93b1-f9e5-4c58-8e67-72b68cfdd5e1	{"13": {"zonas": [], "generales": [{"icon": "square_CM_R", "color": "red", "label": "CM", "condicion": "Corona"}]}}	2025-10-29 15:23:33.286334+00	2	\N	\N
2c06ed04-6325-4a9c-9cdc-e263b1836838	238e93b1-f9e5-4c58-8e67-72b68cfdd5e1	{"12": {"zonas": [], "generales": [{"icon": "circle_CT_R", "color": "red", "label": "CT", "condicion": "Corona temporal"}]}, "13": {"zonas": [], "generales": [{"icon": "square_CM_R", "color": "red", "label": "CM", "condicion": "Corona"}]}}	2025-10-29 15:28:26.644286+00	3	\N	\N
4733535c-629b-4455-ad9d-81f61e7e3fda	238e93b1-f9e5-4c58-8e67-72b68cfdd5e1	{"14": {"zonas": [], "generales": [{"icon": "aor_14_28_blue", "condicion": "linea Aparato ortodóntico removible"}, {"icon": "aparato_remo_inicio_blue", "condicion": "Aparato ortodóntico removible - inicio"}]}, "28": {"zonas": [], "generales": [{"icon": "aparato_remo_fin_blue", "condicion": "Aparato ortodóntico removible - fin"}]}}	2025-10-29 15:29:09.673273+00	4	\N	\N
43e02179-84b0-4fb8-8323-83402a919895	238e93b1-f9e5-4c58-8e67-72b68cfdd5e1	{"15": {"zonas": [], "generales": [{"icon": "clavija_blue", "color": "blue", "condicion": "clavija"}]}}	2025-10-29 15:31:34.081834+00	5	\N	\N
6050677f-c489-4a6c-9806-66bbe057f081	238e93b1-f9e5-4c58-8e67-72b68cfdd5e1	{"14": {"zonas": [{"zona": "vestibular", "color": "blue", "condicion": "Restauración definitiva"}], "generales": [{"icon": "square_IE_B", "color": "blue", "label": "IE", "condicion": "Restauración definitiva"}]}}	2025-10-29 15:31:49.17979+00	6	\N	\N
e53590b6-1715-462f-a162-474e5a38ef9d	0493cea8-0c9c-4f9c-bb4a-cea37b2112d6	{"14": {"zonas": [], "generales": [{"icon": "clavija_blue", "color": "blue", "condicion": "clavija"}]}}	2025-10-29 15:32:05.197439+00	7	\N	\N
9f1fed14-16ce-491f-b924-82120c30b7ea	238e93b1-f9e5-4c58-8e67-72b68cfdd5e1	{"14": {"zonas": [], "generales": [{"icon": "aof_14_25_red", "condicion": "linea Aparato ortodóntico fijo"}, {"icon": "aparato_inicio_red", "condicion": "Aparato ortodóntico fijo - inicio"}]}, "25": {"zonas": [], "generales": [{"icon": "aparato_fin_red", "condicion": "Aparato ortodóntico fijo - fin"}]}}	2025-10-29 16:00:16.963758+00	7	\N	\N
d413e859-7bfb-4d98-9330-d47e87ef5164	238e93b1-f9e5-4c58-8e67-72b68cfdd5e1	{"14": {"zonas": [], "generales": [{"icon": "aor_14_28_blue", "condicion": "linea Aparato ortodóntico removible"}, {"icon": "aparato_remo_inicio_blue", "condicion": "Aparato ortodóntico removible - inicio"}]}, "15": {"zonas": [], "generales": [{"icon": "diastema_izq_blue", "color": "blue", "condicion": "diastema"}]}, "28": {"zonas": [], "generales": [{"icon": "aparato_remo_fin_blue", "condicion": "Aparato ortodóntico removible - fin"}]}}	2025-10-29 16:00:27.695301+00	8	\N	\N
4840951c-5341-4df7-815e-246cbb0260fa	0493cea8-0c9c-4f9c-bb4a-cea37b2112d6	{"12": {"zonas": [], "generales": [{"icon": "aof_12_21_red", "condicion": "linea Aparato ortodóntico fijo"}, {"icon": "aparato_inicio_red", "condicion": "Aparato ortodóntico fijo - inicio"}]}, "14": {"zonas": [], "generales": [{"icon": "clavija_blue", "color": "blue", "condicion": "clavija"}]}, "21": {"zonas": [], "generales": [{"icon": "aparato_fin_red", "condicion": "Aparato ortodóntico fijo - fin"}]}}	2025-10-29 16:37:19.725784+00	8	\N	\N
04a4f986-81b4-4751-9895-35f46c029664	0493cea8-0c9c-4f9c-bb4a-cea37b2112d6	{"12": {"zonas": [], "generales": [{"icon": "aof_12_21_red", "condicion": "linea Aparato ortodóntico fijo"}, {"icon": "aparato_inicio_red", "condicion": "Aparato ortodóntico fijo - inicio"}]}, "14": {"zonas": [], "generales": [{"icon": "clavija_blue", "color": "blue", "condicion": "clavija"}]}, "21": {"zonas": [], "generales": [{"icon": "aparato_fin_red", "condicion": "Aparato ortodóntico fijo - fin"}]}, "23": {"zonas": [], "generales": [{"icon": "path_23", "color": "blue", "label": "S", "condicion": "Sellantes"}, {"icon": "path_23", "color": "blue", "drawPath": "M 83.37499593098958 126.96449279785156 L 83.37499593098958 127.46449279785156 L 83.37499593098958 127.96449279785156 L 83.37499593098958 129.46449279785156 L 83.37499593098958 131.46449279785156 L 83.37499593098958 133.96449279785156 L 85.57499593098957 137.46449279785156 L 87.04166259765624 141.96449279785156 L 89.97499593098958 146.96449279785156 L 94.37499593098957 153.46449279785156 L 98.04166259765624 158.96449279785156 L 102.44166259765625 164.46449279785156 L 106.1083292643229 167.96449279785156 L 109.04166259765624 172.46449279785156 L 111.97499593098958 174.96449279785156 L 114.9083292643229 177.96449279785156 L 116.37499593098957 181.46449279785156 L 117.1083292643229 183.46449279785156 L 117.84166259765624 185.96449279785156 L 118.57499593098957 187.96449279785156 L 119.30832926432291 189.96449279785156 L 119.30832926432291 191.46449279785156 L 119.30832926432291 192.96449279785156 L 119.30832926432291 193.96449279785156 L 118.57499593098957 195.46449279785156 L 117.1083292643229 196.46449279785156 L 116.37499593098957 197.46449279785156 L 113.44166259765625 197.96449279785156 L 110.50832926432291 198.96449279785156 L 108.30832926432291 199.46449279785156 L 105.37499593098957 199.96449279785156 L 102.44166259765625 199.96449279785156 L 99.50832926432291 200.46449279785156 L 96.57499593098957 200.96449279785156 L 94.37499593098957 201.96449279785156 L 92.90832926432292 201.96449279785156 L 91.44166259765625 201.96449279785156 L 89.97499593098958 202.46449279785156 L 89.24166259765624 202.46449279785156 L 88.50832926432291 202.46449279785156 L 88.50832926432291 201.46449279785156 L 88.50832926432291 200.46449279785156 L 88.50832926432291 198.46449279785156 L 88.50832926432291 197.46449279785156 L 88.50832926432291 195.46449279785156 L 88.50832926432291 192.96449279785156 L 88.50832926432291 190.96449279785156 L 89.24166259765624 188.46449279785156 L 90.70832926432291 185.96449279785156 L 92.17499593098958 182.96449279785156 L 93.64166259765625 179.46449279785156 L 96.57499593098957 176.96449279785156 L 99.50832926432291 173.96449279785156 L 103.17499593098958 170.46449279785156 L 108.30832926432291 167.46449279785156 L 111.97499593098958 163.96449279785156 L 115.64166259765624 160.96449279785156 L 119.30832926432291 157.96449279785156 L 123.70832926432291 154.46449279785156 L 128.10832926432292 151.96449279785156 L 131.04166259765623 149.46449279785156 L 133.97499593098956 147.46449279785156 L 137.64166259765625 145.96449279785156 L 138.37499593098957 144.46449279785156 L 139.84166259765624 143.46449279785156 L 141.3083292643229 142.96449279785156 L 141.3083292643229 142.46449279785156 L 142.04166259765623 142.46449279785156 L 142.04166259765623 141.96449279785156 L 142.77499593098958 141.96449279785156", "condicion": "Sellantes"}]}}	2025-11-03 16:01:30.470073+00	9	\N	\N
8ef0491f-d096-41fd-a4b3-33ec48972390	17977759-62ad-4793-8b9e-9dc2b3652cd8	{"11": {"zonas": [], "generales": [{"icon": "aof_11_25_blue", "condicion": "linea Aparato ortodóntico fijo"}, {"icon": "aparato_inicio_blue", "condicion": "Aparato ortodóntico fijo - inicio"}]}, "25": {"zonas": [], "generales": [{"icon": "aparato_fin_blue", "condicion": "Aparato ortodóntico fijo - fin"}]}}	2025-11-08 01:47:42.756263+00	7	\N	\N
e887dfcf-7773-4701-a3c0-b93ca131f7d3	0493cea8-0c9c-4f9c-bb4a-cea37b2112d6	{"12": {"zonas": [], "generales": [{"icon": "aof_12_21_red", "condicion": "linea Aparato ortodóntico fijo"}, {"icon": "aparato_inicio_red", "condicion": "Aparato ortodóntico fijo - inicio"}]}, "14": {"zonas": [], "generales": [{"icon": "clavija_blue", "color": "blue", "condicion": "clavija"}]}, "21": {"zonas": [], "generales": [{"icon": "aparato_fin_red", "condicion": "Aparato ortodóntico fijo - fin"}]}, "23": {"zonas": [], "generales": [{"icon": "path_23", "color": "blue", "label": "S", "condicion": "Sellantes"}, {"icon": "path_23", "color": "blue", "drawPath": "M 83.37499593098958 126.96449279785156 L 83.37499593098958 127.46449279785156 L 83.37499593098958 127.96449279785156 L 83.37499593098958 129.46449279785156 L 83.37499593098958 131.46449279785156 L 83.37499593098958 133.96449279785156 L 85.57499593098957 137.46449279785156 L 87.04166259765624 141.96449279785156 L 89.97499593098958 146.96449279785156 L 94.37499593098957 153.46449279785156 L 98.04166259765624 158.96449279785156 L 102.44166259765625 164.46449279785156 L 106.1083292643229 167.96449279785156 L 109.04166259765624 172.46449279785156 L 111.97499593098958 174.96449279785156 L 114.9083292643229 177.96449279785156 L 116.37499593098957 181.46449279785156 L 117.1083292643229 183.46449279785156 L 117.84166259765624 185.96449279785156 L 118.57499593098957 187.96449279785156 L 119.30832926432291 189.96449279785156 L 119.30832926432291 191.46449279785156 L 119.30832926432291 192.96449279785156 L 119.30832926432291 193.96449279785156 L 118.57499593098957 195.46449279785156 L 117.1083292643229 196.46449279785156 L 116.37499593098957 197.46449279785156 L 113.44166259765625 197.96449279785156 L 110.50832926432291 198.96449279785156 L 108.30832926432291 199.46449279785156 L 105.37499593098957 199.96449279785156 L 102.44166259765625 199.96449279785156 L 99.50832926432291 200.46449279785156 L 96.57499593098957 200.96449279785156 L 94.37499593098957 201.96449279785156 L 92.90832926432292 201.96449279785156 L 91.44166259765625 201.96449279785156 L 89.97499593098958 202.46449279785156 L 89.24166259765624 202.46449279785156 L 88.50832926432291 202.46449279785156 L 88.50832926432291 201.46449279785156 L 88.50832926432291 200.46449279785156 L 88.50832926432291 198.46449279785156 L 88.50832926432291 197.46449279785156 L 88.50832926432291 195.46449279785156 L 88.50832926432291 192.96449279785156 L 88.50832926432291 190.96449279785156 L 89.24166259765624 188.46449279785156 L 90.70832926432291 185.96449279785156 L 92.17499593098958 182.96449279785156 L 93.64166259765625 179.46449279785156 L 96.57499593098957 176.96449279785156 L 99.50832926432291 173.96449279785156 L 103.17499593098958 170.46449279785156 L 108.30832926432291 167.46449279785156 L 111.97499593098958 163.96449279785156 L 115.64166259765624 160.96449279785156 L 119.30832926432291 157.96449279785156 L 123.70832926432291 154.46449279785156 L 128.10832926432292 151.96449279785156 L 131.04166259765623 149.46449279785156 L 133.97499593098956 147.46449279785156 L 137.64166259765625 145.96449279785156 L 138.37499593098957 144.46449279785156 L 139.84166259765624 143.46449279785156 L 141.3083292643229 142.96449279785156 L 141.3083292643229 142.46449279785156 L 142.04166259765623 142.46449279785156 L 142.04166259765623 141.96449279785156 L 142.77499593098958 141.96449279785156", "condicion": "Sellantes"}]}}	2025-11-18 20:55:35.726476+00	10	\N	\N
da2d6c9b-a0c0-4779-9747-bd5b9d673830	0493cea8-0c9c-4f9c-bb4a-cea37b2112d6	{"12": {"zonas": [], "generales": [{"icon": "aof_12_21_red", "condicion": "linea Aparato ortodóntico fijo"}, {"icon": "aparato_inicio_red", "condicion": "Aparato ortodóntico fijo - inicio"}]}, "14": {"zonas": [], "generales": [{"icon": "clavija_blue", "color": "blue", "condicion": "clavija"}, {"icon": "square_CM_R", "color": "red", "label": "CM", "condicion": "Corona"}, {"icon": "path_14", "color": "blue", "label": "S", "condicion": "Sellantes"}, {"icon": "path_14", "color": "blue", "label": "S", "condicion": "Sellantes"}]}, "21": {"zonas": [], "generales": [{"icon": "aparato_fin_red", "condicion": "Aparato ortodóntico fijo - fin"}]}, "23": {"zonas": [], "generales": [{"icon": "path_23", "color": "blue", "label": "S", "condicion": "Sellantes"}, {"icon": "path_23", "color": "blue", "drawPath": "M 83.37499593098958 126.96449279785156 L 83.37499593098958 127.46449279785156 L 83.37499593098958 127.96449279785156 L 83.37499593098958 129.46449279785156 L 83.37499593098958 131.46449279785156 L 83.37499593098958 133.96449279785156 L 85.57499593098957 137.46449279785156 L 87.04166259765624 141.96449279785156 L 89.97499593098958 146.96449279785156 L 94.37499593098957 153.46449279785156 L 98.04166259765624 158.96449279785156 L 102.44166259765625 164.46449279785156 L 106.1083292643229 167.96449279785156 L 109.04166259765624 172.46449279785156 L 111.97499593098958 174.96449279785156 L 114.9083292643229 177.96449279785156 L 116.37499593098957 181.46449279785156 L 117.1083292643229 183.46449279785156 L 117.84166259765624 185.96449279785156 L 118.57499593098957 187.96449279785156 L 119.30832926432291 189.96449279785156 L 119.30832926432291 191.46449279785156 L 119.30832926432291 192.96449279785156 L 119.30832926432291 193.96449279785156 L 118.57499593098957 195.46449279785156 L 117.1083292643229 196.46449279785156 L 116.37499593098957 197.46449279785156 L 113.44166259765625 197.96449279785156 L 110.50832926432291 198.96449279785156 L 108.30832926432291 199.46449279785156 L 105.37499593098957 199.96449279785156 L 102.44166259765625 199.96449279785156 L 99.50832926432291 200.46449279785156 L 96.57499593098957 200.96449279785156 L 94.37499593098957 201.96449279785156 L 92.90832926432292 201.96449279785156 L 91.44166259765625 201.96449279785156 L 89.97499593098958 202.46449279785156 L 89.24166259765624 202.46449279785156 L 88.50832926432291 202.46449279785156 L 88.50832926432291 201.46449279785156 L 88.50832926432291 200.46449279785156 L 88.50832926432291 198.46449279785156 L 88.50832926432291 197.46449279785156 L 88.50832926432291 195.46449279785156 L 88.50832926432291 192.96449279785156 L 88.50832926432291 190.96449279785156 L 89.24166259765624 188.46449279785156 L 90.70832926432291 185.96449279785156 L 92.17499593098958 182.96449279785156 L 93.64166259765625 179.46449279785156 L 96.57499593098957 176.96449279785156 L 99.50832926432291 173.96449279785156 L 103.17499593098958 170.46449279785156 L 108.30832926432291 167.46449279785156 L 111.97499593098958 163.96449279785156 L 115.64166259765624 160.96449279785156 L 119.30832926432291 157.96449279785156 L 123.70832926432291 154.46449279785156 L 128.10832926432292 151.96449279785156 L 131.04166259765623 149.46449279785156 L 133.97499593098956 147.46449279785156 L 137.64166259765625 145.96449279785156 L 138.37499593098957 144.46449279785156 L 139.84166259765624 143.46449279785156 L 141.3083292643229 142.96449279785156 L 141.3083292643229 142.46449279785156 L 142.04166259765623 142.46449279785156 L 142.04166259765623 141.96449279785156 L 142.77499593098958 141.96449279785156", "condicion": "Sellantes"}]}}	2025-11-18 20:57:19.255788+00	11	\N	\N
1cc0db4d-1438-474a-aa4e-e964546e1619	0493cea8-0c9c-4f9c-bb4a-cea37b2112d6	{"14": {"zonas": [], "generales": [{"icon": "aof_14_26_blue", "condicion": "linea Aparato ortodóntico fijo"}, {"icon": "aparato_inicio_blue", "condicion": "Aparato ortodóntico fijo - inicio"}]}, "26": {"zonas": [], "generales": [{"icon": "aparato_fin_blue", "condicion": "Aparato ortodóntico fijo - fin"}]}}	2025-11-18 20:57:49.206128+00	12	\N	\N
ea94fe87-0cd6-4490-9994-9cf0fc480949	0493cea8-0c9c-4f9c-bb4a-cea37b2112d6	{"17": {"zonas": [], "generales": [{"icon": "circle_M1_R", "color": "red", "label": "M1", "condicion": "Movilidad patológica"}]}, "18": {"zonas": [], "generales": [{"icon": "aor_18_28_red", "condicion": "linea Aparato ortodóntico removible"}, {"icon": "aparato_remo_inicio_red", "condicion": "Aparato ortodóntico removible - inicio"}]}, "28": {"zonas": [], "generales": [{"icon": "aparato_remo_fin_red", "condicion": "Aparato ortodóntico removible - fin"}]}, "38": {"zonas": [], "generales": [{"icon": "aparato_remo_fin_blue", "condicion": "Aparato ortodóntico removible - fin"}]}, "48": {"zonas": [], "generales": [{"icon": "aor_48_38_blue", "condicion": "linea Aparato ortodóntico removible"}, {"icon": "aparato_remo_inicio_blue", "condicion": "Aparato ortodóntico removible - inicio"}]}}	2025-11-18 21:06:17.577908+00	13	\N	\N
3f4bc30b-a4be-45c0-ac25-b1a308f82e1a	0493cea8-0c9c-4f9c-bb4a-cea37b2112d6	{"15": {"zonas": [], "generales": [{"icon": "aof_15_26_blue", "condicion": "linea Aparato ortodóntico fijo"}, {"icon": "aparato_inicio_blue", "condicion": "Aparato ortodóntico fijo - inicio"}]}, "26": {"zonas": [], "generales": [{"icon": "aparato_fin_blue", "condicion": "Aparato ortodóntico fijo - fin"}]}}	2025-11-23 05:59:44.921258+00	14	\N	\N
c3dd7864-0e74-4520-9865-bba0155b2ff3	17977759-62ad-4793-8b9e-9dc2b3652cd8	{"11": {"zonas": [], "generales": [{"icon": "aof_11_25_blue", "condicion": "linea Aparato ortodóntico fijo"}, {"icon": "aparato_inicio_blue", "condicion": "Aparato ortodóntico fijo - inicio"}, {"icon": "giro_der_blue", "color": "blue", "condicion": "giro"}]}, "14": {"zonas": [], "generales": [{"icon": "fusion_der_blue", "color": "blue", "condicion": "fusion"}]}, "15": {"zonas": [], "generales": [{"icon": "square_CM_R", "color": "red", "label": "CM", "condicion": "Corona"}]}, "16": {"zonas": [], "generales": [{"icon": "aor_16_26_red", "condicion": "linea Aparato ortodóntico removible"}, {"icon": "aparato_remo_inicio_red", "condicion": "Aparato ortodóntico removible - inicio"}, {"icon": "intruida_blue", "color": "blue", "condicion": "intruida"}]}, "17": {"zonas": [], "generales": [{"icon": "extruida_blue", "color": "blue", "condicion": "extruida"}]}, "21": {"zonas": [], "generales": [{"icon": "ausente_DEX_B", "color": "blue", "label": "DEX", "condicion": "Pieza dentaria ausente"}]}, "22": {"zonas": [], "generales": [{"icon": "path_22", "color": "red", "label": "S", "condicion": "Sellantes"}, {"icon": "path_22", "color": "red", "drawPath": "M 61.416666666666664 191.2265625 L 62.15 191.2265625 L 62.883333333333326 191.2265625 L 64.35 191.7265625 L 72.41666666666666 192.2265625 L 75.35 192.2265625 L 80.48333333333333 192.2265625 L 86.35 192.7265625 L 91.48333333333332 192.7265625 L 96.61666666666666 192.7265625 L 100.28333333333333 192.7265625 L 102.48333333333332 192.7265625 L 104.68333333333332 192.7265625 L 106.88333333333333 193.2265625 L 109.81666666666666 193.7265625 L 112.01666666666667 193.7265625 L 115.68333333333332 193.7265625 L 117.88333333333333 193.7265625 L 120.81666666666666 194.2265625 L 122.28333333333333 194.2265625 L 123.01666666666665 194.2265625 L 125.21666666666665 194.2265625 L 127.41666666666666 194.2265625 L 129.61666666666665 194.7265625 L 130.35 194.7265625 L 131.81666666666666 194.7265625 L 133.28333333333333 194.7265625 L 134.01666666666665 194.7265625 L 136.21666666666667 194.7265625 L 137.68333333333334 194.7265625 L 140.61666666666665 194.7265625 L 143.54999999999998 194.7265625 L 145.75 194.7265625 L 147.21666666666667 194.7265625 L 147.95 194.7265625 L 148.6833333333333 194.7265625 L 149.41666666666666 194.7265625 L 150.14999999999998 194.7265625 L 150.88333333333333 194.7265625 L 152.35 194.7265625 L 153.81666666666666 194.7265625 L 154.54999999999998 194.7265625 L 155.28333333333333 194.7265625 L 156.01666666666665 194.7265625 M 106.88333333333333 158.2265625 L 106.88333333333333 159.2265625 L 106.88333333333333 160.7265625 L 107.61666666666666 163.7265625 L 107.61666666666666 167.2265625 L 107.61666666666666 170.7265625 L 108.35 174.7265625 L 108.35 177.7265625 L 109.08333333333333 181.2265625 L 109.08333333333333 184.2265625 L 109.08333333333333 186.7265625 L 109.08333333333333 189.2265625 L 109.08333333333333 191.7265625 L 109.08333333333333 193.7265625 L 109.08333333333333 196.2265625 L 109.08333333333333 197.2265625 L 109.08333333333333 198.7265625 L 109.81666666666666 199.7265625 L 110.55 200.7265625 L 110.55 202.2265625 L 110.55 202.7265625 L 111.28333333333333 203.7265625 L 111.28333333333333 204.7265625 L 112.01666666666667 206.2265625 L 112.01666666666667 207.2265625 L 112.01666666666667 208.7265625 L 112.01666666666667 209.7265625 L 112.01666666666667 210.7265625 L 112.74999999999999 211.7265625 L 112.74999999999999 212.7265625 L 113.48333333333332 213.7265625 L 113.48333333333332 214.2265625 L 113.48333333333332 215.2265625 L 113.48333333333332 216.2265625 L 113.48333333333332 217.2265625 L 114.21666666666665 218.2265625 L 114.21666666666665 218.7265625 L 114.21666666666665 219.7265625 L 114.21666666666665 220.7265625 L 114.21666666666665 221.2265625 L 114.94999999999999 221.7265625 L 114.94999999999999 222.2265625 L 114.94999999999999 222.7265625 L 114.94999999999999 223.2265625 L 114.94999999999999 223.7265625 L 114.94999999999999 224.2265625 L 114.94999999999999 224.7265625 L 114.94999999999999 225.2265625 L 114.94999999999999 225.7265625 L 114.94999999999999 226.2265625 L 114.21666666666665 226.2265625", "condicion": "Sellantes"}]}, "25": {"zonas": [], "generales": [{"icon": "aparato_fin_blue", "condicion": "Aparato ortodóntico fijo - fin"}]}, "26": {"zonas": [], "generales": [{"icon": "aparato_remo_fin_red", "condicion": "Aparato ortodóntico removible - fin"}]}, "35": {"zonas": [], "generales": [{"icon": "aparato_fin_blue", "condicion": "Aparato ortodóntico fijo - fin"}]}, "41": {"zonas": [], "generales": [{"icon": "giro_der_blue", "color": "blue", "condicion": "giro"}]}, "44": {"zonas": [], "generales": [{"icon": "aof_44_35_blue", "condicion": "linea Aparato ortodóntico fijo"}, {"icon": "aparato_inicio_blue", "condicion": "Aparato ortodóntico fijo - inicio"}]}, "47": {"zonas": [], "generales": [{"icon": "intruida_blue", "color": "blue", "condicion": "intruida"}]}}	2025-11-23 06:57:24.524415+00	8	\N	\N
416c3be3-67f3-4d08-a308-687aacab9f06	0493cea8-0c9c-4f9c-bb4a-cea37b2112d6	{"13": {"zonas": [], "generales": [{"icon": "triangle_RR_R", "color": "red", "label": "RR", "condicion": "Remanente radicular"}]}, "15": {"zonas": [], "generales": [{"icon": "aof_15_26_blue", "condicion": "linea Aparato ortodóntico fijo"}, {"icon": "aparato_inicio_blue", "condicion": "Aparato ortodóntico fijo - inicio"}]}, "26": {"zonas": [], "generales": [{"icon": "aparato_fin_blue", "condicion": "Aparato ortodóntico fijo - fin"}]}}	2025-11-24 17:57:53.562959+00	15	\N	\N
ec734c30-8b34-4d2b-ad7c-66c4fe43d0a9	4d24b29f-0155-461d-83d2-db32c4b74cbd	{"13": {"zonas": [], "generales": [{"icon": "aof_13_26_blue", "condicion": "linea Aparato ortodóntico fijo"}, {"icon": "aparato_inicio_blue", "condicion": "Aparato ortodóntico fijo - inicio"}]}, "26": {"zonas": [], "generales": [{"icon": "aparato_fin_blue", "condicion": "Aparato ortodóntico fijo - fin"}]}, "38": {"zonas": [], "generales": [{"icon": "aparato_remo_fin_red", "condicion": "Aparato ortodóntico removible - fin"}]}, "48": {"zonas": [], "generales": [{"icon": "aor_48_38_red", "condicion": "linea Aparato ortodóntico removible"}, {"icon": "aparato_remo_inicio_red", "condicion": "Aparato ortodóntico removible - inicio"}]}}	2025-11-28 11:19:14.628677+00	1	\N	\N
35118116-1d54-420b-806c-bf83b41ab832	4d24b29f-0155-461d-83d2-db32c4b74cbd	{"12": {"zonas": [], "generales": [{"icon": "circle_CT_R", "color": "red", "label": "CT", "condicion": "Corona temporal"}]}, "13": {"zonas": [], "generales": [{"icon": "aof_13_26_blue", "condicion": "linea Aparato ortodóntico fijo"}, {"icon": "aparato_inicio_blue", "condicion": "Aparato ortodóntico fijo - inicio"}, {"icon": "square_CF_R", "color": "red", "label": "CF", "condicion": "Corona"}]}, "22": {"zonas": [{"zona": "vestibular", "color": "red", "condicion": "Pulpotomía"}], "generales": [{"icon": "circle_PP_R", "color": "red", "label": "PP", "condicion": "Pulpotomía"}]}, "26": {"zonas": [], "generales": [{"icon": "aparato_fin_blue", "condicion": "Aparato ortodóntico fijo - fin"}]}, "38": {"zonas": [], "generales": [{"icon": "aparato_remo_fin_red", "condicion": "Aparato ortodóntico removible - fin"}]}, "48": {"zonas": [], "generales": [{"icon": "aor_48_38_red", "condicion": "linea Aparato ortodóntico removible"}, {"icon": "aparato_remo_inicio_red", "condicion": "Aparato ortodóntico removible - inicio"}]}}	2025-11-29 01:07:04.317801+00	2	\N	\N
a7fa7576-c1d7-439c-805f-5c964eb2ba8f	4d24b29f-0155-461d-83d2-db32c4b74cbd	{"12": {"zonas": [], "generales": [{"icon": "circle_CT_R", "color": "red", "label": "CT", "condicion": "Corona temporal"}]}, "13": {"zonas": [{"zona": "vestibular", "color": "blue", "condicion": "Pulpotomía"}], "generales": [{"icon": "aof_13_26_blue", "condicion": "linea Aparato ortodóntico fijo"}, {"icon": "aparato_inicio_blue", "condicion": "Aparato ortodóntico fijo - inicio"}, {"icon": "square_CF_R", "color": "red", "label": "CF", "condicion": "Corona"}, {"icon": "circle_PP_B", "color": "blue", "label": "PP", "condicion": "Pulpotomía"}]}, "22": {"zonas": [{"zona": "vestibular", "color": "red", "condicion": "Pulpotomía"}, {"zona": "distal", "color": "blue", "condicion": "Pulpotomía"}, {"zona": "vestibular", "color": "blue", "condicion": "Pulpotomía"}], "generales": [{"icon": "circle_PP_R", "color": "red", "label": "PP", "condicion": "Pulpotomía"}, {"icon": "circle_PP_B", "color": "blue", "label": "PP", "condicion": "Pulpotomía"}, {"icon": "circle_PP_B", "color": "blue", "label": "PP", "condicion": "Pulpotomía"}]}, "26": {"zonas": [], "generales": [{"icon": "aparato_fin_blue", "condicion": "Aparato ortodóntico fijo - fin"}]}, "38": {"zonas": [], "generales": [{"icon": "aparato_remo_fin_red", "condicion": "Aparato ortodóntico removible - fin"}]}, "48": {"zonas": [], "generales": [{"icon": "aor_48_38_red", "condicion": "linea Aparato ortodóntico removible"}, {"icon": "aparato_remo_inicio_red", "condicion": "Aparato ortodóntico removible - inicio"}]}}	2025-11-29 01:07:47.488541+00	3	\N	\N
6eb8dae9-b7f0-43fb-bad0-13227a0ffaff	0493cea8-0c9c-4f9c-bb4a-cea37b2112d6	{"17": {"zonas": [], "generales": [{"icon": "circle_M1_R", "color": "red", "label": "M1", "condicion": "Movilidad patológica"}]}}	2025-11-29 21:59:57.747442+00	16	\N	\N
94f8d734-7ebd-4a4a-aa63-a46666a809b0	0493cea8-0c9c-4f9c-bb4a-cea37b2112d6	{"12": {"zonas": [], "generales": [{"icon": "aor_12_21_red", "condicion": "linea Aparato ortodóntico removible"}, {"icon": "aparato_remo_inicio_red", "condicion": "Aparato ortodóntico removible - inicio"}]}, "14": {"zonas": [], "generales": [{"icon": "square_CF_R", "color": "red", "label": "CF", "condicion": "Corona"}]}, "17": {"zonas": [], "generales": [{"icon": "circle_M1_R", "color": "red", "label": "M1", "condicion": "Movilidad patológica"}]}, "21": {"zonas": [], "generales": [{"icon": "aparato_remo_fin_red", "condicion": "Aparato ortodóntico removible - fin"}]}, "31": {"zonas": [], "generales": [{"icon": "aparato_fin_blue", "condicion": "Aparato ortodóntico fijo - fin"}]}, "43": {"zonas": [], "generales": [{"icon": "aof_43_31_blue", "condicion": "linea Aparato ortodóntico fijo"}, {"icon": "aparato_inicio_blue", "condicion": "Aparato ortodóntico fijo - inicio"}]}}	2025-11-29 23:13:54.41266+00	17	\N	\N
e4bb4484-6e48-4822-86c4-3caa9d141bf0	4d24b29f-0155-461d-83d2-db32c4b74cbd	{"12": {"zonas": [], "generales": [{"icon": "circle_CT_R", "color": "red", "label": "CT", "condicion": "Corona temporal"}]}, "13": {"zonas": [{"zona": "vestibular", "color": "blue", "condicion": "Pulpotomía"}], "generales": [{"icon": "aof_13_26_blue", "condicion": "linea Aparato ortodóntico fijo"}, {"icon": "aparato_inicio_blue", "condicion": "Aparato ortodóntico fijo - inicio"}, {"icon": "square_CF_R", "color": "red", "label": "CF", "condicion": "Corona"}, {"icon": "circle_PP_B", "color": "blue", "label": "PP", "condicion": "Pulpotomía"}]}, "14": {"zonas": [{"zona": "vestibular", "color": "red", "condicion": "Lesión de caries dental"}], "generales": [{"icon": "triangle_CDP_R", "color": "red", "label": "CDP", "condicion": "Lesión de caries dental"}]}, "15": {"zonas": [{"zona": "distal", "color": "red", "condicion": "Lesión de caries dental"}], "generales": [{"icon": "triangle_CE_R", "color": "red", "label": "CE", "condicion": "Lesión de caries dental"}]}, "22": {"zonas": [{"zona": "vestibular", "color": "red", "condicion": "Pulpotomía"}, {"zona": "distal", "color": "blue", "condicion": "Pulpotomía"}, {"zona": "vestibular", "color": "blue", "condicion": "Pulpotomía"}], "generales": [{"icon": "circle_PP_R", "color": "red", "label": "PP", "condicion": "Pulpotomía"}, {"icon": "circle_PP_B", "color": "blue", "label": "PP", "condicion": "Pulpotomía"}, {"icon": "circle_PP_B", "color": "blue", "label": "PP", "condicion": "Pulpotomía"}]}, "26": {"zonas": [], "generales": [{"icon": "aparato_fin_blue", "condicion": "Aparato ortodóntico fijo - fin"}]}, "38": {"zonas": [], "generales": [{"icon": "aparato_remo_fin_red", "condicion": "Aparato ortodóntico removible - fin"}]}, "48": {"zonas": [], "generales": [{"icon": "aor_48_38_red", "condicion": "linea Aparato ortodóntico removible"}, {"icon": "aparato_remo_inicio_red", "condicion": "Aparato ortodóntico removible - inicio"}]}}	2025-11-30 00:35:28.174717+00	4	\N	\N
158fd30d-6e6b-4e8a-816b-5d6a998f0627	4d24b29f-0155-461d-83d2-db32c4b74cbd	{"12": {"zonas": [], "generales": [{"icon": "circle_CT_R", "color": "red", "label": "CT", "condicion": "Corona temporal"}]}, "13": {"zonas": [{"zona": "vestibular", "color": "blue", "condicion": "Pulpotomía"}], "generales": [{"icon": "aof_13_26_blue", "condicion": "linea Aparato ortodóntico fijo"}, {"icon": "aparato_inicio_blue", "condicion": "Aparato ortodóntico fijo - inicio"}, {"icon": "square_CF_R", "color": "red", "label": "CF", "condicion": "Corona"}, {"icon": "circle_PP_B", "color": "blue", "label": "PP", "condicion": "Pulpotomía"}]}, "22": {"zonas": [{"zona": "vestibular", "color": "red", "condicion": "Pulpotomía"}, {"zona": "distal", "color": "blue", "condicion": "Pulpotomía"}, {"zona": "vestibular", "color": "blue", "condicion": "Pulpotomía"}], "generales": [{"icon": "circle_PP_R", "color": "red", "label": "PP", "condicion": "Pulpotomía"}, {"icon": "circle_PP_B", "color": "blue", "label": "PP", "condicion": "Pulpotomía"}, {"icon": "circle_PP_B", "color": "blue", "label": "PP", "condicion": "Pulpotomía"}]}, "26": {"zonas": [], "generales": [{"icon": "aparato_fin_blue", "condicion": "Aparato ortodóntico fijo - fin"}]}, "38": {"zonas": [], "generales": [{"icon": "aparato_remo_fin_red", "condicion": "Aparato ortodóntico removible - fin"}]}, "48": {"zonas": [], "generales": [{"icon": "aor_48_38_red", "condicion": "linea Aparato ortodóntico removible"}, {"icon": "aparato_remo_inicio_red", "condicion": "Aparato ortodóntico removible - inicio"}]}, "52": {"zonas": [], "generales": [{"icon": "square_CM_R", "color": "red", "label": "CM", "condicion": "Corona"}]}}	2025-11-30 16:35:04.609693+00	5	\N	\N
a1c08989-a541-4a09-802c-4efbe1a35dfa	4d24b29f-0155-461d-83d2-db32c4b74cbd	{"13": {"zonas": [], "generales": [{"icon": "aof_13_26_blue", "condicion": "linea Aparato ortodóntico fijo"}, {"icon": "aparato_inicio_blue", "condicion": "Aparato ortodóntico fijo - inicio"}]}, "26": {"zonas": [], "generales": [{"icon": "aparato_fin_blue", "condicion": "Aparato ortodóntico fijo - fin"}]}, "38": {"zonas": [], "generales": [{"icon": "aparato_remo_fin_red", "condicion": "Aparato ortodóntico removible - fin"}]}, "48": {"zonas": [], "generales": [{"icon": "aor_48_38_red", "condicion": "linea Aparato ortodóntico removible"}, {"icon": "aparato_remo_inicio_red", "condicion": "Aparato ortodóntico removible - inicio"}]}, "52": {"zonas": [], "generales": [{"icon": "diastema_izq_blue", "color": "blue", "condicion": "diastema"}]}}	2025-11-30 16:35:35.983954+00	6	\N	\N
323230a3-4766-48a7-b09f-12626aa6f02a	4d24b29f-0155-461d-83d2-db32c4b74cbd	{"13": {"zonas": [], "generales": [{"icon": "aof_13_26_blue", "condicion": "linea Aparato ortodóntico fijo"}, {"icon": "aparato_inicio_blue", "condicion": "Aparato ortodóntico fijo - inicio"}]}, "14": {"zonas": [], "generales": [{"icon": "diastema_izq_blue", "color": "blue", "condicion": "diastema"}]}, "26": {"zonas": [], "generales": [{"icon": "aparato_fin_blue", "condicion": "Aparato ortodóntico fijo - fin"}]}, "38": {"zonas": [], "generales": [{"icon": "aparato_remo_fin_red", "condicion": "Aparato ortodóntico removible - fin"}]}, "48": {"zonas": [], "generales": [{"icon": "aor_48_38_red", "condicion": "linea Aparato ortodóntico removible"}, {"icon": "aparato_remo_inicio_red", "condicion": "Aparato ortodóntico removible - inicio"}]}, "52": {"zonas": [], "generales": [{"icon": "diastema_izq_blue", "color": "blue", "condicion": "diastema"}]}}	2025-11-30 16:42:26.871206+00	7	\N	\N
2f7b9bea-558d-4c43-95f6-af57e924ac5d	4d24b29f-0155-461d-83d2-db32c4b74cbd	{"12": {"zonas": [], "generales": [{"icon": "diastema_izq_blue", "color": "blue", "condicion": "diastema"}]}, "18": {"zonas": [], "generales": [{"icon": "aof_18_28_blue", "condicion": "linea Aparato ortodóntico fijo"}, {"icon": "aparato_inicio_blue", "condicion": "Aparato ortodóntico fijo - inicio"}, {"icon": "aor_18_28_red", "condicion": "linea Aparato ortodóntico removible"}, {"icon": "aparato_remo_inicio_red", "condicion": "Aparato ortodóntico removible - inicio"}]}, "28": {"zonas": [], "generales": [{"icon": "aparato_fin_blue", "condicion": "Aparato ortodóntico fijo - fin"}, {"icon": "aparato_remo_fin_red", "condicion": "Aparato ortodóntico removible - fin"}]}, "52": {"zonas": [], "generales": [{"icon": "diastema_izq_blue", "color": "blue", "condicion": "diastema"}]}, "82": {"zonas": [], "generales": [{"icon": "diastema_izq_blue", "color": "blue", "condicion": "diastema"}]}}	2025-11-30 17:20:07.664092+00	8	\N	\N
3a490203-c7fb-49f7-b599-d1eb379c38fd	17977759-62ad-4793-8b9e-9dc2b3652cd8	{"11": {"zonas": [], "generales": [{"icon": "aof_11_25_blue", "condicion": "linea Aparato ortodóntico fijo"}, {"icon": "aparato_inicio_blue", "condicion": "Aparato ortodóntico fijo - inicio"}, {"icon": "giro_der_blue", "color": "blue", "condicion": "giro"}]}, "14": {"zonas": [], "generales": [{"icon": "fusion_der_blue", "color": "blue", "condicion": "fusion"}]}, "15": {"zonas": [], "generales": [{"icon": "square_CM_R", "color": "red", "label": "CM", "condicion": "Corona"}]}, "16": {"zonas": [], "generales": [{"icon": "aor_16_26_red", "condicion": "linea Aparato ortodóntico removible"}, {"icon": "aparato_remo_inicio_red", "condicion": "Aparato ortodóntico removible - inicio"}, {"icon": "intruida_blue", "color": "blue", "condicion": "intruida"}]}, "17": {"zonas": [], "generales": [{"icon": "extruida_blue", "color": "blue", "condicion": "extruida"}]}, "21": {"zonas": [], "generales": [{"icon": "ausente_DEX_B", "color": "blue", "label": "DEX", "condicion": "Pieza dentaria ausente"}]}, "22": {"zonas": [], "generales": [{"icon": "path_22", "color": "red", "label": "S", "condicion": "Sellantes"}, {"icon": "path_22", "color": "red", "drawPath": "M 61.416666666666664 191.2265625 L 62.15 191.2265625 L 62.883333333333326 191.2265625 L 64.35 191.7265625 L 72.41666666666666 192.2265625 L 75.35 192.2265625 L 80.48333333333333 192.2265625 L 86.35 192.7265625 L 91.48333333333332 192.7265625 L 96.61666666666666 192.7265625 L 100.28333333333333 192.7265625 L 102.48333333333332 192.7265625 L 104.68333333333332 192.7265625 L 106.88333333333333 193.2265625 L 109.81666666666666 193.7265625 L 112.01666666666667 193.7265625 L 115.68333333333332 193.7265625 L 117.88333333333333 193.7265625 L 120.81666666666666 194.2265625 L 122.28333333333333 194.2265625 L 123.01666666666665 194.2265625 L 125.21666666666665 194.2265625 L 127.41666666666666 194.2265625 L 129.61666666666665 194.7265625 L 130.35 194.7265625 L 131.81666666666666 194.7265625 L 133.28333333333333 194.7265625 L 134.01666666666665 194.7265625 L 136.21666666666667 194.7265625 L 137.68333333333334 194.7265625 L 140.61666666666665 194.7265625 L 143.54999999999998 194.7265625 L 145.75 194.7265625 L 147.21666666666667 194.7265625 L 147.95 194.7265625 L 148.6833333333333 194.7265625 L 149.41666666666666 194.7265625 L 150.14999999999998 194.7265625 L 150.88333333333333 194.7265625 L 152.35 194.7265625 L 153.81666666666666 194.7265625 L 154.54999999999998 194.7265625 L 155.28333333333333 194.7265625 L 156.01666666666665 194.7265625 M 106.88333333333333 158.2265625 L 106.88333333333333 159.2265625 L 106.88333333333333 160.7265625 L 107.61666666666666 163.7265625 L 107.61666666666666 167.2265625 L 107.61666666666666 170.7265625 L 108.35 174.7265625 L 108.35 177.7265625 L 109.08333333333333 181.2265625 L 109.08333333333333 184.2265625 L 109.08333333333333 186.7265625 L 109.08333333333333 189.2265625 L 109.08333333333333 191.7265625 L 109.08333333333333 193.7265625 L 109.08333333333333 196.2265625 L 109.08333333333333 197.2265625 L 109.08333333333333 198.7265625 L 109.81666666666666 199.7265625 L 110.55 200.7265625 L 110.55 202.2265625 L 110.55 202.7265625 L 111.28333333333333 203.7265625 L 111.28333333333333 204.7265625 L 112.01666666666667 206.2265625 L 112.01666666666667 207.2265625 L 112.01666666666667 208.7265625 L 112.01666666666667 209.7265625 L 112.01666666666667 210.7265625 L 112.74999999999999 211.7265625 L 112.74999999999999 212.7265625 L 113.48333333333332 213.7265625 L 113.48333333333332 214.2265625 L 113.48333333333332 215.2265625 L 113.48333333333332 216.2265625 L 113.48333333333332 217.2265625 L 114.21666666666665 218.2265625 L 114.21666666666665 218.7265625 L 114.21666666666665 219.7265625 L 114.21666666666665 220.7265625 L 114.21666666666665 221.2265625 L 114.94999999999999 221.7265625 L 114.94999999999999 222.2265625 L 114.94999999999999 222.7265625 L 114.94999999999999 223.2265625 L 114.94999999999999 223.7265625 L 114.94999999999999 224.2265625 L 114.94999999999999 224.7265625 L 114.94999999999999 225.2265625 L 114.94999999999999 225.7265625 L 114.94999999999999 226.2265625 L 114.21666666666665 226.2265625", "condicion": "Sellantes"}]}, "25": {"zonas": [], "generales": [{"icon": "aparato_fin_blue", "condicion": "Aparato ortodóntico fijo - fin"}]}, "26": {"zonas": [], "generales": [{"icon": "aparato_remo_fin_red", "condicion": "Aparato ortodóntico removible - fin"}]}, "35": {"zonas": [], "generales": [{"icon": "aparato_fin_blue", "condicion": "Aparato ortodóntico fijo - fin"}]}, "41": {"zonas": [], "generales": [{"icon": "giro_der_blue", "color": "blue", "condicion": "giro"}]}, "44": {"zonas": [], "generales": [{"icon": "aof_44_35_blue", "condicion": "linea Aparato ortodóntico fijo"}, {"icon": "aparato_inicio_blue", "condicion": "Aparato ortodóntico fijo - inicio"}]}, "47": {"zonas": [], "generales": [{"icon": "intruida_blue", "color": "blue", "condicion": "intruida"}]}}	2025-11-30 19:27:01.097852+00	9	\N	\N
e9729f30-7cf9-4d7b-a169-fd6c4120399e	17977759-62ad-4793-8b9e-9dc2b3652cd8	{"55": {"zonas": [], "generales": [{"icon": "aof_55_65_red", "condicion": "linea Aparato ortodóntico fijo"}, {"icon": "aparato_inicio_red", "condicion": "Aparato ortodóntico fijo - inicio"}]}, "65": {"zonas": [], "generales": [{"icon": "aparato_fin_red", "condicion": "Aparato ortodóntico fijo - fin"}]}}	2025-11-30 19:39:52.854427+00	10	\N	\N
4af4c267-ea5b-4f51-9b1f-93cafd01526e	17977759-62ad-4793-8b9e-9dc2b3652cd8	{"55": {"zonas": [], "generales": [{"icon": "aof_55_65_red", "condicion": "linea Aparato ortodóntico fijo"}, {"icon": "aparato_inicio_red", "condicion": "Aparato ortodóntico fijo - inicio"}]}, "65": {"zonas": [], "generales": [{"icon": "aparato_fin_red", "condicion": "Aparato ortodóntico fijo - fin"}]}}	2025-11-30 19:45:20.197035+00	11	dolor	creo
d59dbf9e-bd2d-4b2e-ab73-d6b9fb7b3d15	17977759-62ad-4793-8b9e-9dc2b3652cd8	{"12": {"zonas": [], "generales": [{"icon": "circle_CT_R", "color": "red", "label": "CT", "condicion": "Corona temporal"}]}, "14": {"zonas": [], "generales": [{"icon": "square_CM_R", "color": "red", "label": "CM", "condicion": "Corona"}]}, "55": {"zonas": [], "generales": [{"icon": "aof_55_65_red", "condicion": "linea Aparato ortodóntico fijo"}, {"icon": "aparato_inicio_red", "condicion": "Aparato ortodóntico fijo - inicio"}]}, "65": {"zonas": [], "generales": [{"icon": "aparato_fin_red", "condicion": "Aparato ortodóntico fijo - fin"}]}}	2025-11-30 19:56:03.688319+00	12	dolor	creo
c269f074-8fa2-4268-8718-8b10e02b62ba	17977759-62ad-4793-8b9e-9dc2b3652cd8	{"12": {"zonas": [], "generales": [{"icon": "circle_CT_R", "color": "red", "label": "CT", "condicion": "Corona temporal"}]}, "14": {"zonas": [], "generales": [{"icon": "square_CM_R", "color": "red", "label": "CM", "condicion": "Corona"}]}, "55": {"zonas": [], "generales": [{"icon": "aof_55_65_red", "condicion": "linea Aparato ortodóntico fijo"}, {"icon": "aparato_inicio_red", "condicion": "Aparato ortodóntico fijo - inicio"}]}, "65": {"zonas": [], "generales": [{"icon": "aparato_fin_red", "condicion": "Aparato ortodóntico fijo - fin"}]}}	2025-11-30 20:29:34.861958+00	13	dolo	creo
\.


--
-- Data for Name: pacientes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."pacientes" ("id", "nombres", "apellidos", "fecha_nacimiento", "dni", "genero", "ocupacion", "telefono", "email", "direccion", "lugar_procedencia", "alerta_medica", "antecedentes_patologicos", "habitos", "talla_m", "peso_kg", "imc", "presion_arterial", "created_at", "numero_historia", "grado_instruccion", "pais", "departamento", "provincia", "distrito", "contacto_emergencia", "recomendado_por", "observaciones", "estado_civil") FROM stdin;
4d24b29f-0155-461d-83d2-db32c4b74cbd	Alexis	Coaquira	2017-01-27	75236575	M	\N		adcoaquiraq@gmail.com		\N	\N	\N	\N	\N	\N	\N	\N	2025-11-27 19:48:42.908025+00	HC-2025-4522	\N	\N	\N	\N	\N	\N	\N	\N	\N
17977759-62ad-4793-8b9e-9dc2b3652cd8	LUIS JOSE	RODRIGUEZ SALAS	2015-09-01	00345678	M	Estudiante	987654123	luis.rodriguez@email.com	Jr. Los Girasoles 789	\N	Asma	\N	\N	\N	\N	\N	\N	2025-09-20 16:32:55.107214+00	0003						{"nombre": "", "telefono": "", "domicilio": "", "parentesco": ""}		caries A12	\N
73cfbbe8-7693-487b-8958-30e6812932f6	Sergio	Carrasco	2025-11-26	99999999	M	\N	953434249			\N	\N	\N	\N	\N	\N	\N	\N	2025-11-27 19:37:12.431902+00	HC-2025-4521	\N	\N	\N	\N	\N	\N	\N	\N	\N
bef88313-ecbe-4c78-b0d8-2dd7083afc8e	JULIO LUIS	GOMEZ PEREZ	1945-05-20	00123456	M	Jubilado	987654321	julio.gomez@email.com	Av. Siempre Viva 123	\N	Hipertenso, alergico a la penicilina	\N	\N	\N	\N	\N	\N	2025-09-20 16:32:55.107214+00	0001						{"nombre": "", "telefono": "", "domicilio": "", "parentesco": ""}			
238e93b1-f9e5-4c58-8e67-72b68cfdd5e1	ANA MARIA	MARTINEZ FLORES	2003-02-10	00456789	F	Universitaria	987321654	ana.martinez@email.com	Psj. Las Begonias 101	\N	Ninguna	\N	\N	\N	\N	\N	\N	2025-09-20 16:32:55.107214+00	0004	SUPERIOR	Peru	Tacna	Tacna	Viñani	{"nombre": "996653376", "telefono": "996653376", "domicilio": "Psj. Las Begonias 101", "parentesco": "Madre"}	Dr. Pacompia	Encias debiles	Casado(a)
6be7bfe6-1450-4a43-8027-5f4d258dedca	RIVALDO DANILO	MORON MAYLLE	2025-11-11	72231278	M		+51930257334	rdmoronm@unjbg.edu.pe	MOQUEGUA	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-27 15:59:01.450467+00	HC-2025-4520		Peruano	Moquegua	Mariscal  Nieto	Samegua	{"nombre": "YENY MAYLLE TOLENTINO", "telefono": "930257334", "domicilio": "AV. A. A. CÁCERES 1050", "parentesco": "MADRE"}			Soltero(a)
0493cea8-0c9c-4f9c-bb4a-cea37b2112d6	MARIA FERNANDA	ASJNCAIUSJCN	1990-11-24	12345678-123	F	Ingeniera en sistemas	987123456	adcoaquiraq@unjbg.edu.pe	CALLE FALSA CON MENTIRAS 456	\N	Ninguna	\N	\N	\N	\N	\N	\N	2025-09-20 16:32:55.107214+00	0002	SECUNDARIA COMPLETA	Perú	Tacna	Tacna	Viñani	{"nombre": "996653376", "telefono": "987123456", "domicilio": "PSJ. LAS BEGONIAS 101", "parentesco": "MADRE"}	DR. PACOMPIA	ENCIAS DEBILES	Divorciado(a)
667a5ada-2c47-4397-8598-a02a91478962	XD	XD	2017-12-06	11	F		11	11@gmail.com	11	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-29 00:44:15.062649+00	HC-2025-4525	NO ESPECIFICA	Venezolana :3	Ni idea	No tiene provincia :v	XD	{"nombre": "NO", "telefono": "No", "domicilio": "NO", "parentesco": "NO"}	XD		Soltero(a)
\.


--
-- Data for Name: pagos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."pagos" ("id", "presupuesto_id", "paciente_id", "monto", "moneda_id", "metodo_pago", "numero_comprobante", "tipo_comprobante", "notas", "recibido_por", "fecha_pago", "created_at") FROM stdin;
dc1ad393-34bc-4a8a-8e22-bb3bc6a95ae6	2f3b941a-dfea-4d49-b197-f592bea26682	73cfbbe8-7693-487b-8958-30e6812932f6	10	d91d86da-e1c6-4510-adf2-71f10303e9fe	efectivo	\N	boleta	\N	c65d6183-16bf-4a0a-ac33-14b331e59cc3	2025-11-30 17:32:07.161954+00	2025-11-30 17:32:07.161954+00
1764dfc8-b5ea-4fd1-b61f-d75f57d20adc	2fec4f91-0101-4512-a44d-a34781e03e76	6be7bfe6-1450-4a43-8027-5f4d258dedca	10	d91d86da-e1c6-4510-adf2-71f10303e9fe	yape	\N	boleta	\N	c65d6183-16bf-4a0a-ac33-14b331e59cc3	2025-11-30 17:41:44.919812+00	2025-11-30 17:41:44.919812+00
\.


--
-- Data for Name: personal; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."personal" ("id", "nombre_completo", "rol", "especialidad", "telefono", "email", "activo", "created_at") FROM stdin;
472e0026-4625-4b47-90f9-5319ffad53bd	admin	Odontólogo	ortodoncista		admin@dental.company	t	2025-10-12 05:32:27.018626+00
f919e8ba-c6b1-4f5c-a8ef-b1ded9dcdcc8	admin0	Admin	\N	\N	admin0@dental.company	t	2025-11-18 16:40:04.799365+00
482031d1-1a76-46b2-afa6-2cb569b219c5	ulises	Admin	\N	\N	ulises@dental.company	t	2025-11-18 16:40:04.799365+00
cbe231b9-7260-459b-b71f-5399fe725219	tapion1123	Admin	\N	\N	tapion1123@gmail.com	t	2025-11-18 16:40:04.799365+00
c955e2b0-07b0-455f-8ae5-acd9919fdde2	odontologo4	Admin	\N	\N	odontologo4@dental.company	t	2025-11-18 16:40:04.799365+00
9a794dc9-c93d-42f4-92d9-424ada6ffa9a	dental1	Odontólogo	\N	\N	dental1@dental.company	t	2025-11-28 22:31:16.54519+00
c65d6183-16bf-4a0a-ac33-14b331e59cc3	odontologo3	Admin	\N	\N	odontologo3@dental.company	f	2025-11-18 16:40:04.799365+00
6c806f28-8135-4406-8a4e-e7a8c5fdadec	sergio	Admin	dev	910000000	sergioco@dental.company	t	2025-09-29 18:20:32.283018+00
141b2519-daf3-4bf8-8dac-e97840181403	Danilo	Admin	Periodoncia	900000000	test_personal@dental.company	f	2025-09-22 16:08:53.937654+00
31ec8fab-61ed-4394-b3d0-4595526208b7	danilo26122003	Admin	\N	\N	danilo26122003@gmail.com	f	2025-11-18 16:40:04.799365+00
a228553a-4d6b-4efd-96ec-2f641f19d05a	Alexis	Admin	\N	\N	adcoaquiraq@unjbg.edu.pe	t	2025-11-28 23:10:00.433857+00
63ca9eda-62b0-4772-b849-a0667b99d20f	Jhon	Admin	\N	\N	Jhon@dental.company	t	2025-11-29 00:33:51.72848+00
9f6c18e9-f0aa-4f9e-bbe8-30f487f8e128	danilo	Admin	\N	\N	rdmoronm@unjbg.edu.pe	f	2025-11-27 07:04:14.86073+00
7fd13530-51f9-406e-b127-8377e2832830	pruebaadmin	Admin	\N	\N	danilomm.g73@gmail.com	t	2025-11-30 00:22:49.515678+00
\.


--
-- Data for Name: plan_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."plan_items" ("id", "plan_id", "procedimiento_id", "moneda_id", "estado", "costo", "cantidad", "pieza_dental", "notas", "orden_ejecucion") FROM stdin;
\.


--
-- Data for Name: planes_procedimiento; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."planes_procedimiento" ("id", "paciente_id", "nombre", "costo_total", "moneda_id", "estado", "fecha_creacion", "caso_id") FROM stdin;
\.


--
-- Data for Name: presupuesto_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."presupuesto_items" ("id", "presupuesto_id", "procedimiento_id", "nombre_procedimiento", "pieza_dental", "cantidad", "costo_unitario", "descuento_porcentaje", "costo_final", "estado", "orden_ejecucion", "created_at") FROM stdin;
f12258c9-969c-401b-8cbc-e8f96b143cf7	2f3b941a-dfea-4d49-b197-f592bea26682	533e97bd-9071-42d1-81b5-f0ac66b23d1b	procedimiento1	2.3	1	10.00	0.00	10.00	Pendiente	\N	2025-11-30 17:28:23.974816+00
d70c3afb-090a-4b39-82a0-029b01b3bfa9	2fec4f91-0101-4512-a44d-a34781e03e76	533e97bd-9071-42d1-81b5-f0ac66b23d1b	procedimiento1	1.1	1	10.00	0.00	10.00	Pendiente	\N	2025-11-30 17:41:25.439262+00
\.


--
-- Data for Name: presupuestos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."presupuestos" ("id", "paciente_id", "caso_id", "medico_id", "nombre", "observacion", "especialidad", "costo_total", "estado", "fecha_creacion", "created_at", "moneda_id", "descuento_global", "total_pagado") FROM stdin;
cefe7619-2592-4055-961f-575f18159f05	0493cea8-0c9c-4f9c-bb4a-cea37b2112d6	525db4d5-81e2-46df-b37e-623ec75ec28d	482031d1-1a76-46b2-afa6-2cb569b219c5	xcczvcvxc	xcvxcvcvxcvxcv	\N	35.00	Propuesto	2025-11-30 00:22:03.998812+00	2025-11-30 00:22:03.998812+00	d91d86da-e1c6-4510-adf2-71f10303e9fe	0	0
2f3b941a-dfea-4d49-b197-f592bea26682	73cfbbe8-7693-487b-8958-30e6812932f6	6c9ebbff-fa5e-405f-b9c6-005c0b90491a	\N	Radiografía	\N	Endodoncia	10.00	Por Cobrar	2025-11-30 17:27:29.822334+00	2025-11-30 17:27:29.822334+00	d91d86da-e1c6-4510-adf2-71f10303e9fe	0	10
2fec4f91-0101-4512-a44d-a34781e03e76	6be7bfe6-1450-4a43-8027-5f4d258dedca	dac8defe-13d7-47cd-ba6f-02f4a965e8e0	\N	Presupuesto ortodoncia	\N	Ortodoncia	10.00	Pagado	2025-11-30 17:41:07.002831+00	2025-11-30 17:41:07.002831+00	d91d86da-e1c6-4510-adf2-71f10303e9fe	0	10
\.


--
-- Data for Name: procedimiento_precios; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."procedimiento_precios" ("id", "procedimiento_id", "moneda_id", "precio", "vigente_desde", "vigente_hasta", "created_at") FROM stdin;
a0bf7035-3dee-4271-b0c6-e5287839beb3	533e97bd-9071-42d1-81b5-f0ac66b23d1b	d91d86da-e1c6-4510-adf2-71f10303e9fe	10.00	2025-11-27	\N	2025-11-27 19:24:57.894742+00
78565cc1-1e9a-47c2-87b2-67a0dccd442f	533e97bd-9071-42d1-81b5-f0ac66b23d1b	914f3b56-bb4c-41ae-9432-c1dd72147088	3.00	2025-11-27	\N	2025-11-27 19:24:58.098235+00
a6000c93-f95f-405c-9085-c1dea8215e18	533e97bd-9071-42d1-81b5-f0ac66b23d1b	ec50ecaf-0cb9-4ba8-aafd-7b84756535f8	200.00	2025-11-27	\N	2025-11-27 19:24:58.268503+00
0264aea2-5290-4e9d-99a2-81cd670b595f	0a0a75bb-16b2-41ff-85ed-0ac1d00a6f87	d91d86da-e1c6-4510-adf2-71f10303e9fe	100.00	2025-11-30	\N	2025-11-30 00:48:07.127136+00
614b2a41-76db-4fc1-806e-aabcdfad03a7	0a0a75bb-16b2-41ff-85ed-0ac1d00a6f87	914f3b56-bb4c-41ae-9432-c1dd72147088	30.00	2025-11-30	\N	2025-11-30 00:48:07.313854+00
381f3137-52d6-4d40-a7fe-dd43a0574049	0a0a75bb-16b2-41ff-85ed-0ac1d00a6f87	ec50ecaf-0cb9-4ba8-aafd-7b84756535f8	5000.00	2025-11-30	\N	2025-11-30 00:48:07.501828+00
\.


--
-- Data for Name: procedimientos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."procedimientos" ("id", "nombre", "descripcion", "unidad_id", "grupo_id", "medida", "tipo", "comision_porcentaje", "activo", "fecha_registro") FROM stdin;
533e97bd-9071-42d1-81b5-f0ac66b23d1b	procedimiento1	aa	3b9fe8cd-49f1-4a03-887a-c30175d5b36a	27500606-7469-4030-a37a-46baf4876f35	General	e	0.00	t	2025-11-27 19:24:57.637235+00
0a0a75bb-16b2-41ff-85ed-0ac1d00a6f87	Radiología	\N	3b9fe8cd-49f1-4a03-887a-c30175d5b36a	a290b1f0-8a15-45d3-a588-b996fdfcdb9a	General	\N	0.00	t	2025-11-30 00:48:06.83473+00
\.


--
-- Data for Name: recetas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."recetas" ("id", "caso_id", "cita_id", "paciente_id", "prescriptor_id", "contenido", "fecha", "pdf_url") FROM stdin;
\.


--
-- Data for Name: seguimiento_imagenes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."seguimiento_imagenes" ("id", "seguimiento_id", "ruta", "descripcion", "uploaded_at", "caso_id", "public_id", "titulo", "tipo", "fecha_captura", "url") FROM stdin;
a000012b-01b3-4ab1-8718-c4d47ebd9902	\N	https://res.cloudinary.com/dgyufp0xc/image/upload/c_limit,f_webp,q_auto:best,w_2000/v1764525004/dental_company/casos/dac8defe-13d7-47cd-ba6f-02f4a965e8e0/esteban2_jpg_1764524999611.webp	\N	2025-11-30 17:50:07.395383+00	dac8defe-13d7-47cd-ba6f-02f4a965e8e0	dental_company/casos/dac8defe-13d7-47cd-ba6f-02f4a965e8e0/esteban2_jpg_1764524999611	\N	general	2025-11-30	https://res.cloudinary.com/dgyufp0xc/image/upload/c_limit,f_webp,q_auto:best,w_2000/v1764525004/dental_company/casos/dac8defe-13d7-47cd-ba6f-02f4a965e8e0/esteban2_jpg_1764524999611.webp
\.


--
-- Data for Name: seguimientos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."seguimientos" ("id", "paciente_id", "odontologo_id", "cita_id", "fecha_seguimiento", "procedimiento_id", "observaciones", "fecha_proxima_cita", "caso_id") FROM stdin;
\.


--
-- Data for Name: transacciones_financieras; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."transacciones_financieras" ("id", "cita_id", "monto", "moneda_id", "tipo", "descripcion", "fecha_transaccion") FROM stdin;
\.


--
-- Data for Name: unidades; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."unidades" ("id", "nombre") FROM stdin;
3b9fe8cd-49f1-4a03-887a-c30175d5b36a	Servicios
a4106112-5adb-4ecb-b954-c4b485bf2419	Unidades
3d20b664-1c61-4f33-a689-5d7e9a8d0f32	Litros
d57b014b-4471-4662-ac8c-00b86b1f87c6	Cajas
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") FROM stdin;
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."buckets_analytics" ("name", "type", "format", "created_at", "updated_at", "id", "deleted_at") FROM stdin;
\.


--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."buckets_vectors" ("id", "type", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."migrations" ("id", "name", "hash", "executed_at") FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2025-09-07 22:15:17.922583
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2025-09-07 22:15:17.935618
2	storage-schema	5c7968fd083fcea04050c1b7f6253c9771b99011	2025-09-07 22:15:17.946044
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2025-09-07 22:15:17.982751
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2025-09-07 22:15:18.105158
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2025-09-07 22:15:18.113975
6	change-column-name-in-get-size	f93f62afdf6613ee5e7e815b30d02dc990201044	2025-09-07 22:15:18.122532
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2025-09-07 22:15:18.131176
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2025-09-07 22:15:18.141937
9	fix-search-function	3a0af29f42e35a4d101c259ed955b67e1bee6825	2025-09-07 22:15:18.150697
10	search-files-search-function	68dc14822daad0ffac3746a502234f486182ef6e	2025-09-07 22:15:18.159637
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2025-09-07 22:15:18.170235
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2025-09-07 22:15:18.18591
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2025-09-07 22:15:18.194608
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2025-09-07 22:15:18.202642
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2025-09-07 22:15:18.227089
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2025-09-07 22:15:18.236599
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2025-09-07 22:15:18.244537
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2025-09-07 22:15:18.259982
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2025-09-07 22:15:18.270751
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2025-09-07 22:15:18.278978
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2025-09-07 22:15:18.291422
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2025-09-07 22:15:18.319299
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2025-09-07 22:15:18.334587
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2025-09-07 22:15:18.343225
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2025-09-07 22:15:18.35285
26	objects-prefixes	ef3f7871121cdc47a65308e6702519e853422ae2	2025-09-09 19:30:53.194797
27	search-v2	33b8f2a7ae53105f028e13e9fcda9dc4f356b4a2	2025-09-09 19:30:53.791262
28	object-bucket-name-sorting	ba85ec41b62c6a30a3f136788227ee47f311c436	2025-09-09 19:30:54.286802
29	create-prefixes	a7b1a22c0dc3ab630e3055bfec7ce7d2045c5b7b	2025-09-09 19:30:54.787735
30	update-object-levels	6c6f6cc9430d570f26284a24cf7b210599032db7	2025-09-09 19:30:54.895465
31	objects-level-index	33f1fef7ec7fea08bb892222f4f0f5d79bab5eb8	2025-09-09 19:30:55.289502
32	backward-compatible-index-on-objects	2d51eeb437a96868b36fcdfb1ddefdf13bef1647	2025-09-09 19:30:56.092049
33	backward-compatible-index-on-prefixes	fe473390e1b8c407434c0e470655945b110507bf	2025-09-09 19:30:56.688654
34	optimize-search-function-v1	82b0e469a00e8ebce495e29bfa70a0797f7ebd2c	2025-09-09 19:30:57.082467
35	add-insert-trigger-prefixes	63bb9fd05deb3dc5e9fa66c83e82b152f0caf589	2025-09-09 19:30:58.096151
36	optimise-existing-functions	81cf92eb0c36612865a18016a38496c530443899	2025-09-09 19:30:59.190803
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2025-09-09 19:30:59.987303
38	iceberg-catalog-flag-on-buckets	19a8bd89d5dfa69af7f222a46c726b7c41e462c5	2025-09-09 19:31:00.682838
39	add-search-v2-sort-support	39cf7d1e6bf515f4b02e41237aba845a7b492853	2025-10-03 20:38:44.825574
40	fix-prefix-race-conditions-optimized	fd02297e1c67df25a9fc110bf8c8a9af7fb06d1f	2025-10-03 20:38:44.888089
41	add-object-level-update-trigger	44c22478bf01744b2129efc480cd2edc9a7d60e9	2025-10-03 20:38:44.919423
42	rollback-prefix-triggers	f2ab4f526ab7f979541082992593938c05ee4b47	2025-10-03 20:38:44.923511
43	fix-object-level	ab837ad8f1c7d00cc0b7310e989a23388ff29fc6	2025-10-03 20:38:44.929074
44	vector-bucket-type	99c20c0ffd52bb1ff1f32fb992f3b351e3ef8fb3	2025-11-19 13:56:55.886896
45	vector-buckets	049e27196d77a7cb76497a85afae669d8b230953	2025-11-19 13:56:55.918297
46	buckets-objects-grants	fedeb96d60fefd8e02ab3ded9fbde05632f84aed	2025-11-19 13:56:56.011483
47	iceberg-table-metadata	649df56855c24d8b36dd4cc1aeb8251aa9ad42c2	2025-11-19 13:56:56.014558
48	iceberg-catalog-ids	2666dff93346e5d04e0a878416be1d5fec345d6f	2025-11-19 13:56:56.017785
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata", "level") FROM stdin;
\.


--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."prefixes" ("bucket_id", "name", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."s3_multipart_uploads" ("id", "in_progress_size", "upload_signature", "bucket_id", "key", "version", "owner_id", "created_at", "user_metadata") FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."s3_multipart_uploads_parts" ("id", "upload_id", "size", "part_number", "bucket_id", "key", "etag", "owner_id", "version", "created_at") FROM stdin;
\.


--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."vector_indexes" ("id", "name", "bucket_id", "data_type", "dimension", "distance_metric", "metadata_configuration", "created_at", "updated_at") FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: -
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 646, true);


--
-- Name: cie10_catalogo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."cie10_catalogo_id_seq"', 54, true);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_amr_claims"
    ADD CONSTRAINT "amr_id_pk" PRIMARY KEY ("id");


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."audit_log_entries"
    ADD CONSTRAINT "audit_log_entries_pkey" PRIMARY KEY ("id");


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."flow_state"
    ADD CONSTRAINT "flow_state_pkey" PRIMARY KEY ("id");


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."identities"
    ADD CONSTRAINT "identities_pkey" PRIMARY KEY ("id");


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."identities"
    ADD CONSTRAINT "identities_provider_id_provider_unique" UNIQUE ("provider_id", "provider");


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."instances"
    ADD CONSTRAINT "instances_pkey" PRIMARY KEY ("id");


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_amr_claims"
    ADD CONSTRAINT "mfa_amr_claims_session_id_authentication_method_pkey" UNIQUE ("session_id", "authentication_method");


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_challenges"
    ADD CONSTRAINT "mfa_challenges_pkey" PRIMARY KEY ("id");


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_factors"
    ADD CONSTRAINT "mfa_factors_last_challenged_at_key" UNIQUE ("last_challenged_at");


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_factors"
    ADD CONSTRAINT "mfa_factors_pkey" PRIMARY KEY ("id");


--
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_authorizations"
    ADD CONSTRAINT "oauth_authorizations_authorization_code_key" UNIQUE ("authorization_code");


--
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_authorizations"
    ADD CONSTRAINT "oauth_authorizations_authorization_id_key" UNIQUE ("authorization_id");


--
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_authorizations"
    ADD CONSTRAINT "oauth_authorizations_pkey" PRIMARY KEY ("id");


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_clients"
    ADD CONSTRAINT "oauth_clients_pkey" PRIMARY KEY ("id");


--
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_consents"
    ADD CONSTRAINT "oauth_consents_pkey" PRIMARY KEY ("id");


--
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_consents"
    ADD CONSTRAINT "oauth_consents_user_client_unique" UNIQUE ("user_id", "client_id");


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."one_time_tokens"
    ADD CONSTRAINT "one_time_tokens_pkey" PRIMARY KEY ("id");


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."refresh_tokens"
    ADD CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id");


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."refresh_tokens"
    ADD CONSTRAINT "refresh_tokens_token_unique" UNIQUE ("token");


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."saml_providers"
    ADD CONSTRAINT "saml_providers_entity_id_key" UNIQUE ("entity_id");


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."saml_providers"
    ADD CONSTRAINT "saml_providers_pkey" PRIMARY KEY ("id");


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."saml_relay_states"
    ADD CONSTRAINT "saml_relay_states_pkey" PRIMARY KEY ("id");


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."schema_migrations"
    ADD CONSTRAINT "schema_migrations_pkey" PRIMARY KEY ("version");


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."sessions"
    ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("id");


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."sso_domains"
    ADD CONSTRAINT "sso_domains_pkey" PRIMARY KEY ("id");


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."sso_providers"
    ADD CONSTRAINT "sso_providers_pkey" PRIMARY KEY ("id");


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."users"
    ADD CONSTRAINT "users_phone_key" UNIQUE ("phone");


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");


--
-- Name: ajustes_aplicacion ajustes_aplicacion_clave_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."ajustes_aplicacion"
    ADD CONSTRAINT "ajustes_aplicacion_clave_key" UNIQUE ("clave");


--
-- Name: ajustes_aplicacion ajustes_aplicacion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."ajustes_aplicacion"
    ADD CONSTRAINT "ajustes_aplicacion_pkey" PRIMARY KEY ("id");


--
-- Name: antecedentes antecedentes_historia_id_categoria_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."antecedentes"
    ADD CONSTRAINT "antecedentes_historia_id_categoria_key" UNIQUE ("historia_id", "categoria");


--
-- Name: antecedentes antecedentes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."antecedentes"
    ADD CONSTRAINT "antecedentes_pkey" PRIMARY KEY ("id");


--
-- Name: casos_clinicos casos_clinicos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."casos_clinicos"
    ADD CONSTRAINT "casos_clinicos_pkey" PRIMARY KEY ("id");


--
-- Name: chatbot_cola chatbot_cola_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."chatbot_cola"
    ADD CONSTRAINT "chatbot_cola_pkey" PRIMARY KEY ("id");


--
-- Name: chatbot_contexto chatbot_contexto_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."chatbot_contexto"
    ADD CONSTRAINT "chatbot_contexto_pkey" PRIMARY KEY ("id");


--
-- Name: chatbot_conversaciones chatbot_conversaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."chatbot_conversaciones"
    ADD CONSTRAINT "chatbot_conversaciones_pkey" PRIMARY KEY ("id");


--
-- Name: chatbot_faqs chatbot_faqs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."chatbot_faqs"
    ADD CONSTRAINT "chatbot_faqs_pkey" PRIMARY KEY ("id");


--
-- Name: chatbot_rate_limit chatbot_rate_limit_ip_hash_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."chatbot_rate_limit"
    ADD CONSTRAINT "chatbot_rate_limit_ip_hash_key" UNIQUE ("ip_hash");


--
-- Name: chatbot_rate_limit chatbot_rate_limit_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."chatbot_rate_limit"
    ADD CONSTRAINT "chatbot_rate_limit_pkey" PRIMARY KEY ("id");


--
-- Name: cie10_catalogo cie10_catalogo_codigo_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."cie10_catalogo"
    ADD CONSTRAINT "cie10_catalogo_codigo_key" UNIQUE ("codigo");


--
-- Name: cie10_catalogo cie10_catalogo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."cie10_catalogo"
    ADD CONSTRAINT "cie10_catalogo_pkey" PRIMARY KEY ("id");


--
-- Name: citas citas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."citas"
    ADD CONSTRAINT "citas_pkey" PRIMARY KEY ("id");


--
-- Name: cms_carrusel cms_carrusel_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."cms_carrusel"
    ADD CONSTRAINT "cms_carrusel_pkey" PRIMARY KEY ("id");


--
-- Name: cms_equipo cms_equipo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."cms_equipo"
    ADD CONSTRAINT "cms_equipo_pkey" PRIMARY KEY ("id");


--
-- Name: cms_secciones cms_secciones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."cms_secciones"
    ADD CONSTRAINT "cms_secciones_pkey" PRIMARY KEY ("id");


--
-- Name: cms_secciones cms_secciones_seccion_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."cms_secciones"
    ADD CONSTRAINT "cms_secciones_seccion_key" UNIQUE ("seccion");


--
-- Name: cms_servicio_imagenes cms_servicio_imagenes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."cms_servicio_imagenes"
    ADD CONSTRAINT "cms_servicio_imagenes_pkey" PRIMARY KEY ("id");


--
-- Name: cms_servicios cms_servicios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."cms_servicios"
    ADD CONSTRAINT "cms_servicios_pkey" PRIMARY KEY ("id");


--
-- Name: cms_tema cms_tema_clave_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."cms_tema"
    ADD CONSTRAINT "cms_tema_clave_key" UNIQUE ("clave");


--
-- Name: cms_tema cms_tema_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."cms_tema"
    ADD CONSTRAINT "cms_tema_pkey" PRIMARY KEY ("id");


--
-- Name: codigos_invitacion codigos_invitacion_codigo_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."codigos_invitacion"
    ADD CONSTRAINT "codigos_invitacion_codigo_key" UNIQUE ("codigo");


--
-- Name: codigos_invitacion codigos_invitacion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."codigos_invitacion"
    ADD CONSTRAINT "codigos_invitacion_pkey" PRIMARY KEY ("id");


--
-- Name: config_seguridad config_seguridad_clave_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."config_seguridad"
    ADD CONSTRAINT "config_seguridad_clave_key" UNIQUE ("clave");


--
-- Name: config_seguridad config_seguridad_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."config_seguridad"
    ADD CONSTRAINT "config_seguridad_pkey" PRIMARY KEY ("id");


--
-- Name: consentimientos consentimientos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."consentimientos"
    ADD CONSTRAINT "consentimientos_pkey" PRIMARY KEY ("id");


--
-- Name: cuestionario_respuestas cuestionario_respuestas_historia_id_seccion_pregunta_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."cuestionario_respuestas"
    ADD CONSTRAINT "cuestionario_respuestas_historia_id_seccion_pregunta_key" UNIQUE ("historia_id", "seccion", "pregunta");


--
-- Name: cuestionario_respuestas cuestionario_respuestas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."cuestionario_respuestas"
    ADD CONSTRAINT "cuestionario_respuestas_pkey" PRIMARY KEY ("id");


--
-- Name: diagnosticos diagnosticos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."diagnosticos"
    ADD CONSTRAINT "diagnosticos_pkey" PRIMARY KEY ("id");


--
-- Name: grupos_procedimiento grupos_procedimiento_nombre_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."grupos_procedimiento"
    ADD CONSTRAINT "grupos_procedimiento_nombre_key" UNIQUE ("nombre");


--
-- Name: grupos_procedimiento grupos_procedimiento_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."grupos_procedimiento"
    ADD CONSTRAINT "grupos_procedimiento_pkey" PRIMARY KEY ("id");


--
-- Name: historias_clinicas historias_clinicas_paciente_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."historias_clinicas"
    ADD CONSTRAINT "historias_clinicas_paciente_id_key" UNIQUE ("paciente_id");


--
-- Name: historias_clinicas historias_clinicas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."historias_clinicas"
    ADD CONSTRAINT "historias_clinicas_pkey" PRIMARY KEY ("id");


--
-- Name: imagenes_pacientes imagenes_pacientes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."imagenes_pacientes"
    ADD CONSTRAINT "imagenes_pacientes_pkey" PRIMARY KEY ("id");


--
-- Name: monedas monedas_codigo_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."monedas"
    ADD CONSTRAINT "monedas_codigo_key" UNIQUE ("codigo");


--
-- Name: monedas monedas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."monedas"
    ADD CONSTRAINT "monedas_pkey" PRIMARY KEY ("id");


--
-- Name: numero_historia_secuencia numero_historia_secuencia_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."numero_historia_secuencia"
    ADD CONSTRAINT "numero_historia_secuencia_pkey" PRIMARY KEY ("año");


--
-- Name: pacientes numero_historia_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."pacientes"
    ADD CONSTRAINT "numero_historia_unique" UNIQUE ("numero_historia");


--
-- Name: odontogramas odontograma_paciente_version_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."odontogramas"
    ADD CONSTRAINT "odontograma_paciente_version_unique" UNIQUE ("paciente_id", "version");


--
-- Name: odontogramas odontogramas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."odontogramas"
    ADD CONSTRAINT "odontogramas_pkey" PRIMARY KEY ("id");


--
-- Name: pacientes pacientes_dni_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."pacientes"
    ADD CONSTRAINT "pacientes_dni_key" UNIQUE ("dni");


--
-- Name: pacientes pacientes_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."pacientes"
    ADD CONSTRAINT "pacientes_email_key" UNIQUE ("email");


--
-- Name: pacientes pacientes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."pacientes"
    ADD CONSTRAINT "pacientes_pkey" PRIMARY KEY ("id");


--
-- Name: pagos pagos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."pagos"
    ADD CONSTRAINT "pagos_pkey" PRIMARY KEY ("id");


--
-- Name: personal personal_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."personal"
    ADD CONSTRAINT "personal_email_key" UNIQUE ("email");


--
-- Name: personal personal_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."personal"
    ADD CONSTRAINT "personal_pkey" PRIMARY KEY ("id");


--
-- Name: plan_items plan_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."plan_items"
    ADD CONSTRAINT "plan_items_pkey" PRIMARY KEY ("id");


--
-- Name: planes_procedimiento planes_procedimiento_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."planes_procedimiento"
    ADD CONSTRAINT "planes_procedimiento_pkey" PRIMARY KEY ("id");


--
-- Name: presupuesto_items presupuesto_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."presupuesto_items"
    ADD CONSTRAINT "presupuesto_items_pkey" PRIMARY KEY ("id");


--
-- Name: presupuestos presupuestos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."presupuestos"
    ADD CONSTRAINT "presupuestos_pkey" PRIMARY KEY ("id");


--
-- Name: procedimiento_precios procedimiento_moneda_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."procedimiento_precios"
    ADD CONSTRAINT "procedimiento_moneda_unique" UNIQUE ("procedimiento_id", "moneda_id", "vigente_desde");


--
-- Name: procedimiento_precios procedimiento_precios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."procedimiento_precios"
    ADD CONSTRAINT "procedimiento_precios_pkey" PRIMARY KEY ("id");


--
-- Name: procedimientos procedimientos_nombre_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."procedimientos"
    ADD CONSTRAINT "procedimientos_nombre_key" UNIQUE ("nombre");


--
-- Name: procedimientos procedimientos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."procedimientos"
    ADD CONSTRAINT "procedimientos_pkey" PRIMARY KEY ("id");


--
-- Name: recetas recetas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."recetas"
    ADD CONSTRAINT "recetas_pkey" PRIMARY KEY ("id");


--
-- Name: seguimiento_imagenes seguimiento_imagenes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."seguimiento_imagenes"
    ADD CONSTRAINT "seguimiento_imagenes_pkey" PRIMARY KEY ("id");


--
-- Name: seguimientos seguimientos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."seguimientos"
    ADD CONSTRAINT "seguimientos_pkey" PRIMARY KEY ("id");


--
-- Name: transacciones_financieras transacciones_financieras_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."transacciones_financieras"
    ADD CONSTRAINT "transacciones_financieras_pkey" PRIMARY KEY ("id");


--
-- Name: unidades unidades_nombre_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."unidades"
    ADD CONSTRAINT "unidades_nombre_key" UNIQUE ("nombre");


--
-- Name: unidades unidades_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."unidades"
    ADD CONSTRAINT "unidades_pkey" PRIMARY KEY ("id");


--
-- Name: antecedentes unique_historia_categoria; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."antecedentes"
    ADD CONSTRAINT "unique_historia_categoria" UNIQUE ("historia_id", "categoria");


--
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."buckets_analytics"
    ADD CONSTRAINT "buckets_analytics_pkey" PRIMARY KEY ("id");


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."buckets"
    ADD CONSTRAINT "buckets_pkey" PRIMARY KEY ("id");


--
-- Name: buckets_vectors buckets_vectors_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."buckets_vectors"
    ADD CONSTRAINT "buckets_vectors_pkey" PRIMARY KEY ("id");


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."migrations"
    ADD CONSTRAINT "migrations_name_key" UNIQUE ("name");


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."migrations"
    ADD CONSTRAINT "migrations_pkey" PRIMARY KEY ("id");


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."objects"
    ADD CONSTRAINT "objects_pkey" PRIMARY KEY ("id");


--
-- Name: prefixes prefixes_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."prefixes"
    ADD CONSTRAINT "prefixes_pkey" PRIMARY KEY ("bucket_id", "level", "name");


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads_parts"
    ADD CONSTRAINT "s3_multipart_uploads_parts_pkey" PRIMARY KEY ("id");


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads"
    ADD CONSTRAINT "s3_multipart_uploads_pkey" PRIMARY KEY ("id");


--
-- Name: vector_indexes vector_indexes_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."vector_indexes"
    ADD CONSTRAINT "vector_indexes_pkey" PRIMARY KEY ("id");


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "audit_logs_instance_id_idx" ON "auth"."audit_log_entries" USING "btree" ("instance_id");


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "confirmation_token_idx" ON "auth"."users" USING "btree" ("confirmation_token") WHERE (("confirmation_token")::"text" !~ '^[0-9 ]*$'::"text");


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "email_change_token_current_idx" ON "auth"."users" USING "btree" ("email_change_token_current") WHERE (("email_change_token_current")::"text" !~ '^[0-9 ]*$'::"text");


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "email_change_token_new_idx" ON "auth"."users" USING "btree" ("email_change_token_new") WHERE (("email_change_token_new")::"text" !~ '^[0-9 ]*$'::"text");


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "factor_id_created_at_idx" ON "auth"."mfa_factors" USING "btree" ("user_id", "created_at");


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "flow_state_created_at_idx" ON "auth"."flow_state" USING "btree" ("created_at" DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "identities_email_idx" ON "auth"."identities" USING "btree" ("email" "text_pattern_ops");


--
-- Name: INDEX "identities_email_idx"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX "auth"."identities_email_idx" IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "identities_user_id_idx" ON "auth"."identities" USING "btree" ("user_id");


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "idx_auth_code" ON "auth"."flow_state" USING "btree" ("auth_code");


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "idx_user_id_auth_method" ON "auth"."flow_state" USING "btree" ("user_id", "authentication_method");


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "mfa_challenge_created_at_idx" ON "auth"."mfa_challenges" USING "btree" ("created_at" DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "mfa_factors_user_friendly_name_unique" ON "auth"."mfa_factors" USING "btree" ("friendly_name", "user_id") WHERE (TRIM(BOTH FROM "friendly_name") <> ''::"text");


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "mfa_factors_user_id_idx" ON "auth"."mfa_factors" USING "btree" ("user_id");


--
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "oauth_auth_pending_exp_idx" ON "auth"."oauth_authorizations" USING "btree" ("expires_at") WHERE ("status" = 'pending'::"auth"."oauth_authorization_status");


--
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "oauth_clients_deleted_at_idx" ON "auth"."oauth_clients" USING "btree" ("deleted_at");


--
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "oauth_consents_active_client_idx" ON "auth"."oauth_consents" USING "btree" ("client_id") WHERE ("revoked_at" IS NULL);


--
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "oauth_consents_active_user_client_idx" ON "auth"."oauth_consents" USING "btree" ("user_id", "client_id") WHERE ("revoked_at" IS NULL);


--
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "oauth_consents_user_order_idx" ON "auth"."oauth_consents" USING "btree" ("user_id", "granted_at" DESC);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "one_time_tokens_relates_to_hash_idx" ON "auth"."one_time_tokens" USING "hash" ("relates_to");


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "one_time_tokens_token_hash_hash_idx" ON "auth"."one_time_tokens" USING "hash" ("token_hash");


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "one_time_tokens_user_id_token_type_key" ON "auth"."one_time_tokens" USING "btree" ("user_id", "token_type");


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "reauthentication_token_idx" ON "auth"."users" USING "btree" ("reauthentication_token") WHERE (("reauthentication_token")::"text" !~ '^[0-9 ]*$'::"text");


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "recovery_token_idx" ON "auth"."users" USING "btree" ("recovery_token") WHERE (("recovery_token")::"text" !~ '^[0-9 ]*$'::"text");


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "refresh_tokens_instance_id_idx" ON "auth"."refresh_tokens" USING "btree" ("instance_id");


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "refresh_tokens_instance_id_user_id_idx" ON "auth"."refresh_tokens" USING "btree" ("instance_id", "user_id");


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "refresh_tokens_parent_idx" ON "auth"."refresh_tokens" USING "btree" ("parent");


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "refresh_tokens_session_id_revoked_idx" ON "auth"."refresh_tokens" USING "btree" ("session_id", "revoked");


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "refresh_tokens_updated_at_idx" ON "auth"."refresh_tokens" USING "btree" ("updated_at" DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "saml_providers_sso_provider_id_idx" ON "auth"."saml_providers" USING "btree" ("sso_provider_id");


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "saml_relay_states_created_at_idx" ON "auth"."saml_relay_states" USING "btree" ("created_at" DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "saml_relay_states_for_email_idx" ON "auth"."saml_relay_states" USING "btree" ("for_email");


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "saml_relay_states_sso_provider_id_idx" ON "auth"."saml_relay_states" USING "btree" ("sso_provider_id");


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "sessions_not_after_idx" ON "auth"."sessions" USING "btree" ("not_after" DESC);


--
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "sessions_oauth_client_id_idx" ON "auth"."sessions" USING "btree" ("oauth_client_id");


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "sessions_user_id_idx" ON "auth"."sessions" USING "btree" ("user_id");


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "sso_domains_domain_idx" ON "auth"."sso_domains" USING "btree" ("lower"("domain"));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "sso_domains_sso_provider_id_idx" ON "auth"."sso_domains" USING "btree" ("sso_provider_id");


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "sso_providers_resource_id_idx" ON "auth"."sso_providers" USING "btree" ("lower"("resource_id"));


--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "sso_providers_resource_id_pattern_idx" ON "auth"."sso_providers" USING "btree" ("resource_id" "text_pattern_ops");


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "unique_phone_factor_per_user" ON "auth"."mfa_factors" USING "btree" ("user_id", "phone");


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "user_id_created_at_idx" ON "auth"."sessions" USING "btree" ("user_id", "created_at");


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "users_email_partial_key" ON "auth"."users" USING "btree" ("email") WHERE ("is_sso_user" = false);


--
-- Name: INDEX "users_email_partial_key"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX "auth"."users_email_partial_key" IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "users_instance_id_email_idx" ON "auth"."users" USING "btree" ("instance_id", "lower"(("email")::"text"));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "users_instance_id_idx" ON "auth"."users" USING "btree" ("instance_id");


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "users_is_anonymous_idx" ON "auth"."users" USING "btree" ("is_anonymous");


--
-- Name: chatbot_contexto_embedding_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "chatbot_contexto_embedding_idx" ON "public"."chatbot_contexto" USING "ivfflat" ("embedding" "public"."vector_cosine_ops") WITH ("lists"='5');


--
-- Name: chatbot_faqs_embedding_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "chatbot_faqs_embedding_idx" ON "public"."chatbot_faqs" USING "ivfflat" ("embedding" "public"."vector_cosine_ops") WITH ("lists"='10');


--
-- Name: idx_ajustes_aplicacion_clave; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_ajustes_aplicacion_clave" ON "public"."ajustes_aplicacion" USING "btree" ("clave");


--
-- Name: idx_ajustes_aplicacion_grupo; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_ajustes_aplicacion_grupo" ON "public"."ajustes_aplicacion" USING "btree" ("grupo");


--
-- Name: idx_casos_historia_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_casos_historia_id" ON "public"."casos_clinicos" USING "btree" ("historia_id");


--
-- Name: idx_chatbot_conv_expires; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_chatbot_conv_expires" ON "public"."chatbot_conversaciones" USING "btree" ("expires_at");


--
-- Name: idx_citas_caso_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_citas_caso_id" ON "public"."citas" USING "btree" ("caso_id");


--
-- Name: idx_consentimientos_caso_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_consentimientos_caso_id" ON "public"."consentimientos" USING "btree" ("caso_id");


--
-- Name: idx_cuestionario_respuestas_historia_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_cuestionario_respuestas_historia_id" ON "public"."cuestionario_respuestas" USING "btree" ("historia_id");


--
-- Name: idx_diagnosticos_caso_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_diagnosticos_caso_id" ON "public"."diagnosticos" USING "btree" ("caso_id");


--
-- Name: idx_historias_clinicas_paciente_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_historias_clinicas_paciente_id" ON "public"."historias_clinicas" USING "btree" ("paciente_id");


--
-- Name: idx_imagenes_pacientes_caso_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_imagenes_pacientes_caso_id" ON "public"."imagenes_pacientes" USING "btree" ("caso_id");


--
-- Name: idx_imagenes_pacientes_etapa; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_imagenes_pacientes_etapa" ON "public"."imagenes_pacientes" USING "btree" ("etapa");


--
-- Name: idx_pacientes_numero_historia_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "idx_pacientes_numero_historia_unique" ON "public"."pacientes" USING "btree" ("numero_historia");


--
-- Name: idx_pagos_fecha; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_pagos_fecha" ON "public"."pagos" USING "btree" ("fecha_pago");


--
-- Name: idx_pagos_paciente_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_pagos_paciente_id" ON "public"."pagos" USING "btree" ("paciente_id");


--
-- Name: idx_pagos_presupuesto_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_pagos_presupuesto_id" ON "public"."pagos" USING "btree" ("presupuesto_id");


--
-- Name: idx_recetas_caso_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_recetas_caso_id" ON "public"."recetas" USING "btree" ("caso_id");


--
-- Name: idx_seguimiento_imagenes_caso_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_seguimiento_imagenes_caso_id" ON "public"."seguimiento_imagenes" USING "btree" ("caso_id");


--
-- Name: idx_seguimientos_caso_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_seguimientos_caso_id" ON "public"."seguimientos" USING "btree" ("caso_id");


--
-- Name: idx_servicio_imagenes_orden; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_servicio_imagenes_orden" ON "public"."cms_servicio_imagenes" USING "btree" ("servicio_id", "orden");


--
-- Name: idx_servicio_imagenes_servicio_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_servicio_imagenes_servicio_id" ON "public"."cms_servicio_imagenes" USING "btree" ("servicio_id");


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX "bname" ON "storage"."buckets" USING "btree" ("name");


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX "bucketid_objname" ON "storage"."objects" USING "btree" ("bucket_id", "name");


--
-- Name: buckets_analytics_unique_name_idx; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX "buckets_analytics_unique_name_idx" ON "storage"."buckets_analytics" USING "btree" ("name") WHERE ("deleted_at" IS NULL);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX "idx_multipart_uploads_list" ON "storage"."s3_multipart_uploads" USING "btree" ("bucket_id", "key", "created_at");


--
-- Name: idx_name_bucket_level_unique; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX "idx_name_bucket_level_unique" ON "storage"."objects" USING "btree" ("name" COLLATE "C", "bucket_id", "level");


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX "idx_objects_bucket_id_name" ON "storage"."objects" USING "btree" ("bucket_id", "name" COLLATE "C");


--
-- Name: idx_objects_lower_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX "idx_objects_lower_name" ON "storage"."objects" USING "btree" (("path_tokens"["level"]), "lower"("name") "text_pattern_ops", "bucket_id", "level");


--
-- Name: idx_prefixes_lower_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX "idx_prefixes_lower_name" ON "storage"."prefixes" USING "btree" ("bucket_id", "level", (("string_to_array"("name", '/'::"text"))["level"]), "lower"("name") "text_pattern_ops");


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX "name_prefix_search" ON "storage"."objects" USING "btree" ("name" "text_pattern_ops");


--
-- Name: objects_bucket_id_level_idx; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX "objects_bucket_id_level_idx" ON "storage"."objects" USING "btree" ("bucket_id", "level", "name" COLLATE "C");


--
-- Name: vector_indexes_name_bucket_id_idx; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX "vector_indexes_name_bucket_id_idx" ON "storage"."vector_indexes" USING "btree" ("name", "bucket_id");


--
-- Name: historias_clinicas set_timestamp_historias_clinicas; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "set_timestamp_historias_clinicas" BEFORE UPDATE ON "public"."historias_clinicas" FOR EACH ROW EXECUTE FUNCTION "public"."trigger_set_timestamp"();


--
-- Name: transacciones_financieras trigger_actualizar_costo_cita; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "trigger_actualizar_costo_cita" AFTER INSERT OR DELETE OR UPDATE ON "public"."transacciones_financieras" FOR EACH ROW EXECUTE FUNCTION "public"."actualizar_costo_cita"();


--
-- Name: plan_items trigger_actualizar_costo_plan; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "trigger_actualizar_costo_plan" AFTER INSERT OR DELETE OR UPDATE ON "public"."plan_items" FOR EACH ROW EXECUTE FUNCTION "public"."actualizar_costo_plan"();


--
-- Name: pagos trigger_actualizar_total_pagado; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "trigger_actualizar_total_pagado" AFTER INSERT OR DELETE OR UPDATE ON "public"."pagos" FOR EACH ROW EXECUTE FUNCTION "public"."actualizar_total_pagado"();


--
-- Name: ajustes_aplicacion trigger_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "trigger_actualizar_updated_at" BEFORE UPDATE ON "public"."ajustes_aplicacion" FOR EACH ROW EXECUTE FUNCTION "public"."actualizar_updated_at"();


--
-- Name: pacientes trigger_generar_numero_historia; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "trigger_generar_numero_historia" BEFORE INSERT ON "public"."pacientes" FOR EACH ROW WHEN ((("new"."numero_historia" IS NULL) OR ("new"."numero_historia" = ''::"text"))) EXECUTE FUNCTION "public"."generar_numero_historia"();


--
-- Name: cms_servicio_imagenes trigger_servicio_imagenes_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "trigger_servicio_imagenes_updated_at" BEFORE UPDATE ON "public"."cms_servicio_imagenes" FOR EACH ROW EXECUTE FUNCTION "public"."update_servicio_imagenes_updated_at"();


--
-- Name: chatbot_faqs update_chatbot_faqs_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "update_chatbot_faqs_updated_at" BEFORE UPDATE ON "public"."chatbot_faqs" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();


--
-- Name: cms_secciones update_cms_secciones_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "update_cms_secciones_updated_at" BEFORE UPDATE ON "public"."cms_secciones" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();


--
-- Name: cms_servicios update_cms_servicios_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "update_cms_servicios_updated_at" BEFORE UPDATE ON "public"."cms_servicios" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();


--
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER "enforce_bucket_name_length_trigger" BEFORE INSERT OR UPDATE OF "name" ON "storage"."buckets" FOR EACH ROW EXECUTE FUNCTION "storage"."enforce_bucket_name_length"();


--
-- Name: objects objects_delete_delete_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER "objects_delete_delete_prefix" AFTER DELETE ON "storage"."objects" FOR EACH ROW EXECUTE FUNCTION "storage"."delete_prefix_hierarchy_trigger"();


--
-- Name: objects objects_insert_create_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER "objects_insert_create_prefix" BEFORE INSERT ON "storage"."objects" FOR EACH ROW EXECUTE FUNCTION "storage"."objects_insert_prefix_trigger"();


--
-- Name: objects objects_update_create_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER "objects_update_create_prefix" BEFORE UPDATE ON "storage"."objects" FOR EACH ROW WHEN ((("new"."name" <> "old"."name") OR ("new"."bucket_id" <> "old"."bucket_id"))) EXECUTE FUNCTION "storage"."objects_update_prefix_trigger"();


--
-- Name: prefixes prefixes_create_hierarchy; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER "prefixes_create_hierarchy" BEFORE INSERT ON "storage"."prefixes" FOR EACH ROW WHEN (("pg_trigger_depth"() < 1)) EXECUTE FUNCTION "storage"."prefixes_insert_trigger"();


--
-- Name: prefixes prefixes_delete_hierarchy; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER "prefixes_delete_hierarchy" AFTER DELETE ON "storage"."prefixes" FOR EACH ROW EXECUTE FUNCTION "storage"."delete_prefix_hierarchy_trigger"();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER "update_objects_updated_at" BEFORE UPDATE ON "storage"."objects" FOR EACH ROW EXECUTE FUNCTION "storage"."update_updated_at_column"();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."identities"
    ADD CONSTRAINT "identities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_amr_claims"
    ADD CONSTRAINT "mfa_amr_claims_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "auth"."sessions"("id") ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_challenges"
    ADD CONSTRAINT "mfa_challenges_auth_factor_id_fkey" FOREIGN KEY ("factor_id") REFERENCES "auth"."mfa_factors"("id") ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_factors"
    ADD CONSTRAINT "mfa_factors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_authorizations"
    ADD CONSTRAINT "oauth_authorizations_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "auth"."oauth_clients"("id") ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_authorizations"
    ADD CONSTRAINT "oauth_authorizations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_consents"
    ADD CONSTRAINT "oauth_consents_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "auth"."oauth_clients"("id") ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_consents"
    ADD CONSTRAINT "oauth_consents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."one_time_tokens"
    ADD CONSTRAINT "one_time_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."refresh_tokens"
    ADD CONSTRAINT "refresh_tokens_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "auth"."sessions"("id") ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."saml_providers"
    ADD CONSTRAINT "saml_providers_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."saml_relay_states"
    ADD CONSTRAINT "saml_relay_states_flow_state_id_fkey" FOREIGN KEY ("flow_state_id") REFERENCES "auth"."flow_state"("id") ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."saml_relay_states"
    ADD CONSTRAINT "saml_relay_states_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE CASCADE;


--
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."sessions"
    ADD CONSTRAINT "sessions_oauth_client_id_fkey" FOREIGN KEY ("oauth_client_id") REFERENCES "auth"."oauth_clients"("id") ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."sessions"
    ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."sso_domains"
    ADD CONSTRAINT "sso_domains_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE CASCADE;


--
-- Name: antecedentes antecedentes_historia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."antecedentes"
    ADD CONSTRAINT "antecedentes_historia_id_fkey" FOREIGN KEY ("historia_id") REFERENCES "public"."historias_clinicas"("id");


--
-- Name: casos_clinicos casos_clinicos_historia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."casos_clinicos"
    ADD CONSTRAINT "casos_clinicos_historia_id_fkey" FOREIGN KEY ("historia_id") REFERENCES "public"."historias_clinicas"("id");


--
-- Name: casos_clinicos casos_clinicos_presupuesto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."casos_clinicos"
    ADD CONSTRAINT "casos_clinicos_presupuesto_id_fkey" FOREIGN KEY ("presupuesto_id") REFERENCES "public"."planes_procedimiento"("id");


--
-- Name: citas citas_caso_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."citas"
    ADD CONSTRAINT "citas_caso_id_fkey" FOREIGN KEY ("caso_id") REFERENCES "public"."casos_clinicos"("id");


--
-- Name: citas citas_moneda_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."citas"
    ADD CONSTRAINT "citas_moneda_id_fkey" FOREIGN KEY ("moneda_id") REFERENCES "public"."monedas"("id");


--
-- Name: citas citas_odontologo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."citas"
    ADD CONSTRAINT "citas_odontologo_id_fkey" FOREIGN KEY ("odontologo_id") REFERENCES "public"."personal"("id");


--
-- Name: citas citas_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."citas"
    ADD CONSTRAINT "citas_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "public"."pacientes"("id") ON DELETE CASCADE;


--
-- Name: cms_secciones cms_secciones_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."cms_secciones"
    ADD CONSTRAINT "cms_secciones_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id");


--
-- Name: cms_servicio_imagenes cms_servicio_imagenes_servicio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."cms_servicio_imagenes"
    ADD CONSTRAINT "cms_servicio_imagenes_servicio_id_fkey" FOREIGN KEY ("servicio_id") REFERENCES "public"."cms_servicios"("id") ON DELETE CASCADE;


--
-- Name: codigos_invitacion codigos_invitacion_creado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."codigos_invitacion"
    ADD CONSTRAINT "codigos_invitacion_creado_por_fkey" FOREIGN KEY ("creado_por") REFERENCES "auth"."users"("id");


--
-- Name: codigos_invitacion codigos_invitacion_usado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."codigos_invitacion"
    ADD CONSTRAINT "codigos_invitacion_usado_por_fkey" FOREIGN KEY ("usado_por") REFERENCES "auth"."users"("id");


--
-- Name: consentimientos consentimientos_caso_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."consentimientos"
    ADD CONSTRAINT "consentimientos_caso_id_fkey" FOREIGN KEY ("caso_id") REFERENCES "public"."casos_clinicos"("id") ON DELETE CASCADE;


--
-- Name: consentimientos consentimientos_firmado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."consentimientos"
    ADD CONSTRAINT "consentimientos_firmado_por_fkey" FOREIGN KEY ("firmado_por") REFERENCES "public"."personal"("id");


--
-- Name: consentimientos consentimientos_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."consentimientos"
    ADD CONSTRAINT "consentimientos_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "public"."pacientes"("id");


--
-- Name: cuestionario_respuestas cuestionario_respuestas_historia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."cuestionario_respuestas"
    ADD CONSTRAINT "cuestionario_respuestas_historia_id_fkey" FOREIGN KEY ("historia_id") REFERENCES "public"."historias_clinicas"("id") ON DELETE CASCADE;


--
-- Name: diagnosticos diagnosticos_caso_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."diagnosticos"
    ADD CONSTRAINT "diagnosticos_caso_id_fkey" FOREIGN KEY ("caso_id") REFERENCES "public"."casos_clinicos"("id") ON DELETE CASCADE;


--
-- Name: diagnosticos diagnosticos_cie10_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."diagnosticos"
    ADD CONSTRAINT "diagnosticos_cie10_id_fkey" FOREIGN KEY ("cie10_id") REFERENCES "public"."cie10_catalogo"("id") ON DELETE RESTRICT;


--
-- Name: diagnosticos diagnosticos_odontologo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."diagnosticos"
    ADD CONSTRAINT "diagnosticos_odontologo_id_fkey" FOREIGN KEY ("odontologo_id") REFERENCES "public"."personal"("id");


--
-- Name: presupuestos fk_moneda; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."presupuestos"
    ADD CONSTRAINT "fk_moneda" FOREIGN KEY ("moneda_id") REFERENCES "public"."monedas"("id");


--
-- Name: imagenes_pacientes fk_paciente; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."imagenes_pacientes"
    ADD CONSTRAINT "fk_paciente" FOREIGN KEY ("paciente_id") REFERENCES "public"."pacientes"("id") ON DELETE CASCADE;


--
-- Name: grupos_procedimiento grupos_procedimiento_unidad_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."grupos_procedimiento"
    ADD CONSTRAINT "grupos_procedimiento_unidad_id_fkey" FOREIGN KEY ("unidad_id") REFERENCES "public"."unidades"("id");


--
-- Name: historias_clinicas historias_clinicas_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."historias_clinicas"
    ADD CONSTRAINT "historias_clinicas_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "public"."pacientes"("id") ON DELETE CASCADE;


--
-- Name: imagenes_pacientes imagenes_pacientes_caso_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."imagenes_pacientes"
    ADD CONSTRAINT "imagenes_pacientes_caso_id_fkey" FOREIGN KEY ("caso_id") REFERENCES "public"."casos_clinicos"("id") ON DELETE SET NULL;


--
-- Name: odontogramas odontogramas_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."odontogramas"
    ADD CONSTRAINT "odontogramas_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "public"."pacientes"("id") ON DELETE CASCADE;


--
-- Name: pagos pagos_moneda_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."pagos"
    ADD CONSTRAINT "pagos_moneda_id_fkey" FOREIGN KEY ("moneda_id") REFERENCES "public"."monedas"("id");


--
-- Name: pagos pagos_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."pagos"
    ADD CONSTRAINT "pagos_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "public"."pacientes"("id");


--
-- Name: pagos pagos_presupuesto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."pagos"
    ADD CONSTRAINT "pagos_presupuesto_id_fkey" FOREIGN KEY ("presupuesto_id") REFERENCES "public"."presupuestos"("id") ON DELETE CASCADE;


--
-- Name: pagos pagos_recibido_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."pagos"
    ADD CONSTRAINT "pagos_recibido_por_fkey" FOREIGN KEY ("recibido_por") REFERENCES "public"."personal"("id");


--
-- Name: personal personal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."personal"
    ADD CONSTRAINT "personal_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: plan_items plan_items_moneda_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."plan_items"
    ADD CONSTRAINT "plan_items_moneda_id_fkey" FOREIGN KEY ("moneda_id") REFERENCES "public"."monedas"("id");


--
-- Name: plan_items plan_items_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."plan_items"
    ADD CONSTRAINT "plan_items_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "public"."planes_procedimiento"("id") ON DELETE CASCADE;


--
-- Name: plan_items plan_items_procedimiento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."plan_items"
    ADD CONSTRAINT "plan_items_procedimiento_id_fkey" FOREIGN KEY ("procedimiento_id") REFERENCES "public"."procedimientos"("id");


--
-- Name: planes_procedimiento planes_procedimiento_caso_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."planes_procedimiento"
    ADD CONSTRAINT "planes_procedimiento_caso_id_fkey" FOREIGN KEY ("caso_id") REFERENCES "public"."casos_clinicos"("id");


--
-- Name: planes_procedimiento planes_procedimiento_moneda_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."planes_procedimiento"
    ADD CONSTRAINT "planes_procedimiento_moneda_id_fkey" FOREIGN KEY ("moneda_id") REFERENCES "public"."monedas"("id");


--
-- Name: planes_procedimiento planes_procedimiento_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."planes_procedimiento"
    ADD CONSTRAINT "planes_procedimiento_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "public"."pacientes"("id") ON DELETE CASCADE;


--
-- Name: presupuesto_items presupuesto_items_presupuesto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."presupuesto_items"
    ADD CONSTRAINT "presupuesto_items_presupuesto_id_fkey" FOREIGN KEY ("presupuesto_id") REFERENCES "public"."presupuestos"("id") ON DELETE CASCADE;


--
-- Name: presupuesto_items presupuesto_items_procedimiento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."presupuesto_items"
    ADD CONSTRAINT "presupuesto_items_procedimiento_id_fkey" FOREIGN KEY ("procedimiento_id") REFERENCES "public"."procedimientos"("id");


--
-- Name: presupuestos presupuestos_caso_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."presupuestos"
    ADD CONSTRAINT "presupuestos_caso_id_fkey" FOREIGN KEY ("caso_id") REFERENCES "public"."casos_clinicos"("id");


--
-- Name: presupuestos presupuestos_medico_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."presupuestos"
    ADD CONSTRAINT "presupuestos_medico_id_fkey" FOREIGN KEY ("medico_id") REFERENCES "public"."personal"("id");


--
-- Name: presupuestos presupuestos_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."presupuestos"
    ADD CONSTRAINT "presupuestos_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "public"."pacientes"("id");


--
-- Name: procedimiento_precios procedimiento_precios_moneda_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."procedimiento_precios"
    ADD CONSTRAINT "procedimiento_precios_moneda_id_fkey" FOREIGN KEY ("moneda_id") REFERENCES "public"."monedas"("id");


--
-- Name: procedimiento_precios procedimiento_precios_procedimiento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."procedimiento_precios"
    ADD CONSTRAINT "procedimiento_precios_procedimiento_id_fkey" FOREIGN KEY ("procedimiento_id") REFERENCES "public"."procedimientos"("id") ON DELETE CASCADE;


--
-- Name: procedimientos procedimientos_grupo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."procedimientos"
    ADD CONSTRAINT "procedimientos_grupo_id_fkey" FOREIGN KEY ("grupo_id") REFERENCES "public"."grupos_procedimiento"("id");


--
-- Name: procedimientos procedimientos_unidad_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."procedimientos"
    ADD CONSTRAINT "procedimientos_unidad_id_fkey" FOREIGN KEY ("unidad_id") REFERENCES "public"."unidades"("id");


--
-- Name: recetas recetas_caso_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."recetas"
    ADD CONSTRAINT "recetas_caso_id_fkey" FOREIGN KEY ("caso_id") REFERENCES "public"."casos_clinicos"("id") ON DELETE CASCADE;


--
-- Name: recetas recetas_cita_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."recetas"
    ADD CONSTRAINT "recetas_cita_id_fkey" FOREIGN KEY ("cita_id") REFERENCES "public"."citas"("id");


--
-- Name: recetas recetas_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."recetas"
    ADD CONSTRAINT "recetas_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "public"."pacientes"("id");


--
-- Name: recetas recetas_prescriptor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."recetas"
    ADD CONSTRAINT "recetas_prescriptor_id_fkey" FOREIGN KEY ("prescriptor_id") REFERENCES "public"."personal"("id");


--
-- Name: seguimiento_imagenes seguimiento_imagenes_caso_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."seguimiento_imagenes"
    ADD CONSTRAINT "seguimiento_imagenes_caso_id_fkey" FOREIGN KEY ("caso_id") REFERENCES "public"."casos_clinicos"("id") ON DELETE CASCADE;


--
-- Name: seguimiento_imagenes seguimiento_imagenes_seguimiento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."seguimiento_imagenes"
    ADD CONSTRAINT "seguimiento_imagenes_seguimiento_id_fkey" FOREIGN KEY ("seguimiento_id") REFERENCES "public"."seguimientos"("id") ON DELETE CASCADE;


--
-- Name: seguimientos seguimientos_caso_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."seguimientos"
    ADD CONSTRAINT "seguimientos_caso_id_fkey" FOREIGN KEY ("caso_id") REFERENCES "public"."casos_clinicos"("id");


--
-- Name: seguimientos seguimientos_cita_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."seguimientos"
    ADD CONSTRAINT "seguimientos_cita_id_fkey" FOREIGN KEY ("cita_id") REFERENCES "public"."citas"("id") ON DELETE SET NULL;


--
-- Name: seguimientos seguimientos_odontologo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."seguimientos"
    ADD CONSTRAINT "seguimientos_odontologo_id_fkey" FOREIGN KEY ("odontologo_id") REFERENCES "public"."personal"("id");


--
-- Name: seguimientos seguimientos_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."seguimientos"
    ADD CONSTRAINT "seguimientos_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "public"."pacientes"("id") ON DELETE CASCADE;


--
-- Name: seguimientos seguimientos_procedimiento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."seguimientos"
    ADD CONSTRAINT "seguimientos_procedimiento_id_fkey" FOREIGN KEY ("procedimiento_id") REFERENCES "public"."procedimientos"("id");


--
-- Name: transacciones_financieras transacciones_financieras_cita_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."transacciones_financieras"
    ADD CONSTRAINT "transacciones_financieras_cita_id_fkey" FOREIGN KEY ("cita_id") REFERENCES "public"."citas"("id") ON DELETE SET NULL;


--
-- Name: transacciones_financieras transacciones_financieras_moneda_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."transacciones_financieras"
    ADD CONSTRAINT "transacciones_financieras_moneda_id_fkey" FOREIGN KEY ("moneda_id") REFERENCES "public"."monedas"("id");


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."objects"
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id");


--
-- Name: prefixes prefixes_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."prefixes"
    ADD CONSTRAINT "prefixes_bucketId_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id");


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads"
    ADD CONSTRAINT "s3_multipart_uploads_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id");


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads_parts"
    ADD CONSTRAINT "s3_multipart_uploads_parts_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id");


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads_parts"
    ADD CONSTRAINT "s3_multipart_uploads_parts_upload_id_fkey" FOREIGN KEY ("upload_id") REFERENCES "storage"."s3_multipart_uploads"("id") ON DELETE CASCADE;


--
-- Name: vector_indexes vector_indexes_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."vector_indexes"
    ADD CONSTRAINT "vector_indexes_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets_vectors"("id");


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."audit_log_entries" ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."flow_state" ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."identities" ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."instances" ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."mfa_amr_claims" ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."mfa_challenges" ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."mfa_factors" ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."one_time_tokens" ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."refresh_tokens" ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."saml_providers" ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."saml_relay_states" ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."schema_migrations" ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."sessions" ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."sso_domains" ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."sso_providers" ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."users" ENABLE ROW LEVEL SECURITY;

--
-- Name: ajustes_aplicacion Ajustes son visibles para todos los usuarios autenticados; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Ajustes son visibles para todos los usuarios autenticados" ON "public"."ajustes_aplicacion" FOR SELECT TO "authenticated" USING (true);


--
-- Name: cms_carrusel CMS carrusel admin write; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "CMS carrusel admin write" ON "public"."cms_carrusel" USING (("auth"."role"() = 'authenticated'::"text"));


--
-- Name: cms_carrusel CMS carrusel read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "CMS carrusel read" ON "public"."cms_carrusel" FOR SELECT USING ((("visible" = true) OR ("auth"."role"() = 'authenticated'::"text")));


--
-- Name: cms_equipo CMS equipo admin write; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "CMS equipo admin write" ON "public"."cms_equipo" USING (("auth"."role"() = 'authenticated'::"text"));


--
-- Name: cms_equipo CMS equipo read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "CMS equipo read" ON "public"."cms_equipo" FOR SELECT USING ((("visible" = true) OR ("auth"."role"() = 'authenticated'::"text")));


--
-- Name: cms_secciones CMS secciones admin write; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "CMS secciones admin write" ON "public"."cms_secciones" USING (("auth"."role"() = 'authenticated'::"text"));


--
-- Name: cms_secciones CMS secciones read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "CMS secciones read" ON "public"."cms_secciones" FOR SELECT USING ((("visible" = true) OR ("auth"."role"() = 'authenticated'::"text")));


--
-- Name: cms_servicios CMS servicios admin write; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "CMS servicios admin write" ON "public"."cms_servicios" USING (("auth"."role"() = 'authenticated'::"text"));


--
-- Name: cms_servicios CMS servicios read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "CMS servicios read" ON "public"."cms_servicios" FOR SELECT USING ((("visible" = true) OR ("auth"."role"() = 'authenticated'::"text")));


--
-- Name: cms_tema CMS tema admin write; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "CMS tema admin write" ON "public"."cms_tema" USING (("auth"."role"() = 'authenticated'::"text"));


--
-- Name: cms_tema CMS tema público; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "CMS tema público" ON "public"."cms_tema" FOR SELECT USING (true);


--
-- Name: chatbot_faqs Chatbot FAQs admin write; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Chatbot FAQs admin write" ON "public"."chatbot_faqs" USING (("auth"."role"() = 'authenticated'::"text"));


--
-- Name: chatbot_faqs Chatbot FAQs read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Chatbot FAQs read" ON "public"."chatbot_faqs" FOR SELECT USING ((("activo" = true) OR ("auth"."role"() = 'authenticated'::"text")));


--
-- Name: chatbot_contexto Chatbot contexto admin write; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Chatbot contexto admin write" ON "public"."chatbot_contexto" USING (("auth"."role"() = 'authenticated'::"text"));


--
-- Name: chatbot_contexto Chatbot contexto read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Chatbot contexto read" ON "public"."chatbot_contexto" FOR SELECT USING ((("activo" = true) OR ("auth"."role"() = 'authenticated'::"text")));


--
-- Name: chatbot_conversaciones Chatbot conv admin read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Chatbot conv admin read" ON "public"."chatbot_conversaciones" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));


--
-- Name: chatbot_conversaciones Chatbot conv insert público; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Chatbot conv insert público" ON "public"."chatbot_conversaciones" FOR INSERT WITH CHECK (true);


--
-- Name: config_seguridad Config seguridad admin write; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Config seguridad admin write" ON "public"."config_seguridad" USING (("auth"."role"() = 'authenticated'::"text"));


--
-- Name: config_seguridad Config seguridad lectura pública; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Config seguridad lectura pública" ON "public"."config_seguridad" FOR SELECT USING (true);


--
-- Name: codigos_invitacion Códigos invitación admin; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Códigos invitación admin" ON "public"."codigos_invitacion" USING (("auth"."role"() = 'authenticated'::"text"));


--
-- Name: presupuesto_items Enable all for authenticated users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable all for authenticated users" ON "public"."presupuesto_items" TO "authenticated" USING (true);


--
-- Name: presupuestos Enable all for authenticated users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable all for authenticated users" ON "public"."presupuestos" TO "authenticated" USING (true);


--
-- Name: numero_historia_secuencia Lectura de secuencia para usuarios autenticados; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Lectura de secuencia para usuarios autenticados" ON "public"."numero_historia_secuencia" FOR SELECT TO "authenticated" USING (true);


--
-- Name: personal Personal delete by authenticated; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Personal delete by authenticated" ON "public"."personal" FOR DELETE USING (("auth"."role"() = 'authenticated'::"text"));


--
-- Name: personal Personal modificable para autenticados; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Personal modificable para autenticados" ON "public"."personal" USING (("auth"."role"() = 'authenticated'::"text"));


--
-- Name: personal Personal visible para autenticados; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Personal visible para autenticados" ON "public"."personal" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));


--
-- Name: cms_servicio_imagenes Servicio imágenes admin write; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Servicio imágenes admin write" ON "public"."cms_servicio_imagenes" USING (("auth"."role"() = 'authenticated'::"text"));


--
-- Name: cms_servicio_imagenes Servicio imágenes lectura pública; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Servicio imágenes lectura pública" ON "public"."cms_servicio_imagenes" FOR SELECT USING (("visible" = true));


--
-- Name: ajustes_aplicacion Solo administradores pueden modificar ajustes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Solo administradores pueden modificar ajustes" ON "public"."ajustes_aplicacion" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."personal"
  WHERE (("personal"."id" = "auth"."uid"()) AND ("personal"."rol" = 'Admin'::"public"."rol") AND ("personal"."activo" = true))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."personal"
  WHERE (("personal"."id" = "auth"."uid"()) AND ("personal"."rol" = 'Admin'::"public"."rol") AND ("personal"."activo" = true)))));


--
-- Name: personal Users can update their own personal record; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own personal record" ON "public"."personal" FOR UPDATE USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));


--
-- Name: codigos_invitacion Verificar código público; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Verificar código público" ON "public"."codigos_invitacion" FOR SELECT USING ((("activo" = true) AND (("usos_actuales" < "usos_maximos") OR ("usos_maximos" IS NULL))));


--
-- Name: ajustes_aplicacion; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."ajustes_aplicacion" ENABLE ROW LEVEL SECURITY;

--
-- Name: chatbot_contexto; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."chatbot_contexto" ENABLE ROW LEVEL SECURITY;

--
-- Name: chatbot_conversaciones; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."chatbot_conversaciones" ENABLE ROW LEVEL SECURITY;

--
-- Name: chatbot_faqs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."chatbot_faqs" ENABLE ROW LEVEL SECURITY;

--
-- Name: cms_carrusel; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."cms_carrusel" ENABLE ROW LEVEL SECURITY;

--
-- Name: cms_equipo; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."cms_equipo" ENABLE ROW LEVEL SECURITY;

--
-- Name: cms_secciones; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."cms_secciones" ENABLE ROW LEVEL SECURITY;

--
-- Name: cms_servicio_imagenes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."cms_servicio_imagenes" ENABLE ROW LEVEL SECURITY;

--
-- Name: cms_servicios; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."cms_servicios" ENABLE ROW LEVEL SECURITY;

--
-- Name: cms_tema; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."cms_tema" ENABLE ROW LEVEL SECURITY;

--
-- Name: codigos_invitacion; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."codigos_invitacion" ENABLE ROW LEVEL SECURITY;

--
-- Name: config_seguridad; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."config_seguridad" ENABLE ROW LEVEL SECURITY;

--
-- Name: personal; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."personal" ENABLE ROW LEVEL SECURITY;

--
-- Name: presupuesto_items; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."presupuesto_items" ENABLE ROW LEVEL SECURITY;

--
-- Name: presupuestos; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."presupuestos" ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."buckets" ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."buckets_analytics" ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_vectors; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."buckets_vectors" ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."migrations" ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;

--
-- Name: prefixes; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."prefixes" ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."s3_multipart_uploads" ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."s3_multipart_uploads_parts" ENABLE ROW LEVEL SECURITY;

--
-- Name: vector_indexes; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."vector_indexes" ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--

\unrestrict 4Ed9fe7lavQjMTTbECYNhNuZohBAgYPN1mtj6y3j0zGyNy0fuXNlXbacrRVByGi

