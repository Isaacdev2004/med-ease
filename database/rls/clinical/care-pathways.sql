-- clinical.care_pathway_* / care_plans / steps / tasks — tenant isolation (Epic 3 / P0)

ALTER TABLE clinical.care_pathway_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.care_pathway_definitions FORCE ROW LEVEL SECURITY;

CREATE POLICY care_pathway_definitions_tenant_isolation ON clinical.care_pathway_definitions
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.care_pathway_step_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.care_pathway_step_definitions FORCE ROW LEVEL SECURITY;

CREATE POLICY care_pathway_step_definitions_tenant_isolation ON clinical.care_pathway_step_definitions
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.care_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.care_plans FORCE ROW LEVEL SECURITY;

CREATE POLICY care_plans_tenant_isolation ON clinical.care_plans
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.care_plan_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.care_plan_steps FORCE ROW LEVEL SECURITY;

CREATE POLICY care_plan_steps_tenant_isolation ON clinical.care_plan_steps
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.care_plan_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.care_plan_tasks FORCE ROW LEVEL SECURITY;

CREATE POLICY care_plan_tasks_tenant_isolation ON clinical.care_plan_tasks
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));
